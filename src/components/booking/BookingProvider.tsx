"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Service } from "@/data/services";

interface BookingContextValue {
  selectedServices: Service[];
  addService: (service: Service) => void;
  removeService: (serviceId: string) => void;
  clearServices: () => void;
}

const BookingContext = createContext<BookingContextValue | undefined>(
  undefined,
);

const STORAGE_KEY = "executive-hideaway-booking";

export function BookingProvider({ children }: { children: ReactNode }) {
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Restore booking state from sessionStorage after initial hydration.
  // Initialize with empty array to avoid hydration mismatch (server renders
  // [], client also renders [] initially). After hydration, restore persisted state.
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);

      if (stored) {
        const parsed: unknown = JSON.parse(stored);

        if (Array.isArray(parsed)) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setSelectedServices(parsed as Service[]);
        }
      }
    } catch {
      sessionStorage.removeItem(STORAGE_KEY);
    }

    setIsHydrated(true);
  }, []);

  // Persist booking state only after hydration completes.
  useEffect(() => {
    if (!isHydrated) return;

    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(selectedServices),
      );
    } catch {
      // Storage can be unavailable in some browser configurations.
    }
  }, [selectedServices, isHydrated]);

  const addService = (service: Service) => {
    setSelectedServices((current) => {
      if (current.some((item) => item.id === service.id)) {
        return current;
      }

      return [...current, service];
    });
  };

  const removeService = (serviceId: string) => {
    setSelectedServices((current) =>
      current.filter((service) => service.id !== serviceId),
    );
  };

  const clearServices = () => {
    setSelectedServices([]);
  };

  return (
    <BookingContext.Provider
      value={{
        selectedServices,
        addService,
        removeService,
        clearServices,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);

  if (!context) {
    throw new Error("useBooking must be used inside BookingProvider");
  }

  return context;
}
