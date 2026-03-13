"use client";

import React, { useState } from "react";
import { Menu } from "@/lib/types";
import { getContrastColor, getWhatsAppUrl, getGoogleMapsUrl } from "@/lib/utils";
import { getPatternStyle } from "@/lib/patterns";
import { getOpenStatus } from "@/lib/hours";
import {
  MapPin,
  Phone,
  MessageCircle,
  ChevronDown,
  Calendar,
} from "lucide-react";
import HoursModal from "./HoursModal";

interface MenuHeroProps {
  menu: Menu;
  onRecordEvent?: (eventType: string) => void;
}

export default function MenuHero({ menu, onRecordEvent }: MenuHeroProps) {
  const { restaurant, design } = menu;
  const contrastColor = getContrastColor(design.primaryColor);
  const patternStyle = getPatternStyle(design.backgroundPattern, contrastColor);
  const [showHours, setShowHours] = useState(false);

  const initials = restaurant.name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const openStatus = getOpenStatus(restaurant.hours);

  // Only the 3 essential quick actions
  const mapsUrl =
    restaurant.location.googleMapsUrl ||
    (restaurant.location.address
      ? getGoogleMapsUrl(restaurant.location.address)
      : null);
  const hasPhone = !!restaurant.contact.phone;
  const hasWhatsApp = !!restaurant.contact.whatsapp;

  // Delivery
  const delivery = restaurant.delivery;
  const hasDelivery =
    delivery &&
    (delivery.uberEats ||
      delivery.wolt ||
      delivery.mrD ||
      delivery.deliveroo ||
      (delivery.custom && delivery.custom.length > 0));

  // Booking
  const bookingEnabled = restaurant.bookingEnabled;
  const bookingUrl = restaurant.bookingUrl
    ? restaurant.bookingUrl
    : hasWhatsApp
      ? buildBookingWhatsAppUrl(restaurant.contact.whatsapp!, restaurant.name)
      : undefined;

  const handleRecord = (eventType: string) => {
    onRecordEvent?.(eventType);
  };

  // Semi-transparent background for buttons
  const btnBg =
    contrastColor === "#FFFFFF"
      ? "rgba(255,255,255,0.15)"
      : "rgba(0,0,0,0.10)";

  return (
    <>
      <section
        className="relative flex flex-col items-center justify-center text-center py-12 px-6 overflow-hidden"
        style={{ backgroundColor: design.primaryColor, color: contrastColor }}
      >
        {/* Cover image background */}
        {restaurant.coverImage && (
          <>
            <img
              src={restaurant.coverImage}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
              aria-hidden="true"
            />
            {/* Dark gradient overlay for text readability */}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(180deg, ${design.primaryColor}D0 0%, ${design.primaryColor}B8 50%, ${design.primaryColor}E8 100%)`,
              }}
              aria-hidden="true"
            />
          </>
        )}

        {/* Background pattern overlay */}
        {design.backgroundPattern !== "none" && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={patternStyle}
            aria-hidden="true"
          />
        )}

        {/* Content */}
        <div className="relative z-[1] flex flex-col items-center w-full max-w-md">
          {/* A. Logo + Name + Tagline */}
          <div className="flex flex-col items-center gap-2.5 mb-4">
            {restaurant.logo ? (
              <img
                src={restaurant.logo}
                alt={`${restaurant.name} logo`}
                className="max-w-20 max-h-20 object-contain"
              />
            ) : (
              <div
                className="w-18 h-18 rounded-full flex items-center justify-center text-xl font-bold"
                style={{
                  backgroundColor: contrastColor,
                  color: design.primaryColor,
                  fontFamily: design.headingFont,
                  width: 72,
                  height: 72,
                }}
              >
                {initials}
              </div>
            )}

            <h1
              style={{
                fontFamily: "var(--menu-font-heading)",
                fontSize: "32px",
                fontWeight: 400,
                letterSpacing: "-0.02em",
              }}
            >
              {restaurant.name}
            </h1>

            {restaurant.tagline && (
              <p
                className="opacity-70 max-w-xs"
                style={{
                  fontFamily: "var(--menu-font-body)",
                  fontSize: "14px",
                  fontStyle: "italic",
                }}
              >
                {restaurant.tagline}
              </p>
            )}
          </div>

          {/* B. Open/Closed Status Badge */}
          {openStatus && (
            <button
              onClick={() => setShowHours(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold mb-5 transition-opacity hover:opacity-90"
              style={{
                backgroundColor: openStatus.isOpen ? "#22C55E" : "#EF4444",
                color: "#FFFFFF",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  backgroundColor: "#FFFFFF",
                }}
              />
              {openStatus.isOpen ? "Open" : "Closed"}
              {openStatus.nextChange && (
                <>
                  <span className="opacity-60">{"\u00B7"}</span>
                  <span className="font-medium opacity-90">
                    {openStatus.nextChange}
                  </span>
                </>
              )}
            </button>
          )}

          {/* C. Essential Quick Actions — Directions, Call, WhatsApp */}
          <div className="flex items-center justify-center gap-5 mb-5">
            {mapsUrl && (
              <QuickAction
                href={mapsUrl}
                icon={<MapPin className="w-5 h-5" />}
                label="Directions"
                bgColor={btnBg}
                color={contrastColor}
                onClick={() => handleRecord("directions_click")}
              />
            )}
            {hasPhone && (
              <QuickAction
                href={`tel:${restaurant.contact.phone}`}
                icon={<Phone className="w-5 h-5" />}
                label="Call"
                bgColor={btnBg}
                color={contrastColor}
                onClick={() => handleRecord("phone_click")}
                newTab={false}
              />
            )}
            {hasWhatsApp && (
              <QuickAction
                href={getWhatsAppUrl(
                  restaurant.contact.whatsapp!,
                  restaurant.name
                )}
                icon={<MessageCircle className="w-5 h-5" />}
                label="WhatsApp"
                bgColor={btnBg}
                color={contrastColor}
                onClick={() => handleRecord("whatsapp_click")}
              />
            )}
          </div>

          {/* D. Delivery Row — branded buttons */}
          {hasDelivery && (
            <div className="flex items-center justify-center gap-2 flex-wrap mb-4">
              {delivery!.uberEats && (
                <DeliveryButton
                  href={delivery!.uberEats}
                  label="Uber Eats"
                  brandColor="#000000"
                  onClick={() => handleRecord("delivery_click")}
                />
              )}
              {delivery!.wolt && (
                <DeliveryButton
                  href={delivery!.wolt}
                  label="Wolt"
                  brandColor="#009de0"
                  onClick={() => handleRecord("delivery_click")}
                />
              )}
              {delivery!.mrD && (
                <DeliveryButton
                  href={delivery!.mrD}
                  label="Mr D"
                  brandColor="#E4002B"
                  onClick={() => handleRecord("delivery_click")}
                />
              )}
              {delivery!.deliveroo && (
                <DeliveryButton
                  href={delivery!.deliveroo}
                  label="Deliveroo"
                  brandColor="#00CCBC"
                  onClick={() => handleRecord("delivery_click")}
                />
              )}
              {delivery!.custom?.map((custom) => (
                <DeliveryButton
                  key={custom.name}
                  href={custom.url}
                  label={custom.name}
                  brandColor={design.accentColor}
                  onClick={() => handleRecord("delivery_click")}
                />
              ))}
            </div>
          )}

          {/* E. Book a Table Button */}
          {bookingEnabled && bookingUrl && (
            <a
              href={bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-2.5 font-medium text-sm transition-opacity hover:opacity-90 mb-2"
              style={{
                backgroundColor: design.accentColor,
                color: getContrastColor(design.accentColor),
                borderRadius: "var(--menu-radius-pill)",
                padding: "10px 20px",
                fontFamily: "var(--menu-font-body)",
                fontSize: "14px",
                fontWeight: 500,
              }}
              onClick={() => handleRecord("booking_click")}
            >
              <Calendar className="w-4 h-4" />
              Book a Table
            </a>
          )}
        </div>

        {/* F. Scroll indicator */}
        <div
          className="relative z-[1] mt-5 animate-bounce"
          style={{ color: contrastColor, opacity: 0.4 }}
        >
          <ChevronDown className="w-5 h-5" />
        </div>
      </section>

      {/* Hours Modal */}
      {restaurant.hours && Object.keys(restaurant.hours).length > 0 && (
        <HoursModal
          hours={restaurant.hours}
          design={design}
          isOpen={showHours}
          onClose={() => setShowHours(false)}
        />
      )}
    </>
  );
}

/* ---- Sub-components ---- */

function QuickAction({
  href,
  icon,
  label,
  bgColor,
  color,
  onClick,
  newTab = true,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  bgColor: string;
  color: string;
  onClick?: () => void;
  newTab?: boolean;
}) {
  return (
    <a
      href={href}
      target={newTab ? "_blank" : undefined}
      rel={newTab ? "noopener noreferrer" : undefined}
      className="flex flex-col items-center gap-1.5 transition-opacity hover:opacity-80"
      onClick={onClick}
    >
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center"
        style={{ backgroundColor: bgColor, color }}
      >
        {icon}
      </div>
      <span className="text-[10px] font-medium opacity-60" style={{ color }}>
        {label}
      </span>
    </a>
  );
}

function DeliveryButton({
  href,
  label,
  brandColor,
  onClick,
}: {
  href: string;
  label: string;
  brandColor: string;
  onClick?: () => void;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 px-5 py-2 text-sm font-bold transition-all hover:opacity-90 hover:scale-[1.02]"
      style={{
        backgroundColor: brandColor,
        color: "#FFFFFF",
        borderRadius: "9999px",
        boxShadow: `0 2px 8px ${brandColor}40`,
      }}
      onClick={onClick}
    >
      {label}
    </a>
  );
}

/* ---- URL helpers ---- */

function buildBookingWhatsAppUrl(number: string, name: string): string {
  const cleaned = number.replace(/\s+/g, "").replace(/[^+\d]/g, "");
  const message = encodeURIComponent(
    "I'd like to book a table at " + name
  );
  return "https://wa.me/" + cleaned + "?text=" + message;
}
