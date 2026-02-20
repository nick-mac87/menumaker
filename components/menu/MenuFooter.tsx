"use client";

import React from "react";
import { Menu } from "@/lib/types";
import {
  getWhatsAppUrl,
  getGoogleMapsUrl,
  getContrastColor,
} from "@/lib/utils";
import { getFormattedHours } from "@/lib/hours";
import {
  Clock,
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Instagram,
  Facebook,
  Globe,
  ExternalLink,
  Calendar,
} from "lucide-react";

interface MenuFooterProps {
  menu: Menu;
  onRecordEvent?: (eventType: string) => void;
}

export default function MenuFooter({ menu, onRecordEvent }: MenuFooterProps) {
  const { restaurant, design } = menu;

  const hasHours =
    restaurant.hours && Object.keys(restaurant.hours).length > 0;
  const hasContact =
    restaurant.contact.phone ||
    restaurant.contact.whatsapp ||
    restaurant.contact.email;
  const hasSocial =
    restaurant.social.instagram ||
    restaurant.social.facebook ||
    restaurant.social.tiktok ||
    restaurant.social.website;

  const mapsUrl =
    restaurant.location.googleMapsUrl ||
    getGoogleMapsUrl(restaurant.location.address);

  const delivery = restaurant.delivery;
  const hasDelivery =
    delivery &&
    (delivery.uberEats ||
      delivery.wolt ||
      delivery.mrD ||
      delivery.deliveroo ||
      (delivery.custom && delivery.custom.length > 0));

  const bookingEnabled = restaurant.bookingEnabled;
  const bookingUrl = restaurant.bookingUrl
    ? restaurant.bookingUrl
    : restaurant.contact.whatsapp
      ? buildBookingWhatsAppUrl(restaurant.contact.whatsapp, restaurant.name)
      : undefined;

  const formattedHours = hasHours
    ? getFormattedHours(restaurant.hours!)
    : [];

  const handleRecord = (eventType: string) => {
    onRecordEvent?.(eventType);
  };

  return (
    <footer
      className="px-6 pt-8 pb-10"
      style={{
        backgroundColor: "var(--menu-surface)",
        color: "var(--menu-text)",
        fontFamily: "var(--menu-font-body)",
        borderTop: "1px solid var(--menu-border)",
      }}
    >
      <div className="max-w-lg mx-auto flex flex-col gap-0">
        {/* Opening hours */}
        {hasHours && formattedHours.length > 0 && (
          <FooterSection>
            <SectionHeader icon={<Clock className="w-4 h-4" />} label="Opening Hours" />
            <div className="flex flex-col gap-1">
              {formattedHours.map((entry, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-1.5 px-2 text-sm"
                  style={{
                    borderRadius: "var(--menu-radius-sm)",
                    backgroundColor: entry.isToday
                      ? "var(--menu-surface-hover)"
                      : "transparent",
                  }}
                >
                  <div className="flex items-center gap-2">
                    {entry.isToday && (
                      <div
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: "var(--menu-accent)" }}
                      />
                    )}
                    <span
                      style={{
                        fontWeight: entry.isToday ? 700 : 400,
                        color: entry.isToday
                          ? "var(--menu-text)"
                          : "var(--menu-text-secondary)",
                      }}
                    >
                      {entry.day}
                    </span>
                  </div>
                  <span
                    style={{
                      fontWeight: entry.isToday ? 700 : 500,
                      color: entry.isToday
                        ? "var(--menu-accent)"
                        : "var(--menu-text)",
                    }}
                  >
                    {entry.time}
                  </span>
                </div>
              ))}
            </div>
          </FooterSection>
        )}

        {/* Location */}
        {restaurant.location.address && (
          <FooterSection>
            <SectionHeader icon={<MapPin className="w-4 h-4" />} label="Location" />
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm inline-flex items-center gap-1 underline underline-offset-2 hover:opacity-80 transition-opacity"
              style={{ color: "var(--menu-accent)" }}
              onClick={() => handleRecord("directions_click")}
            >
              {restaurant.location.address}
              <ExternalLink className="w-3 h-3" />
            </a>
          </FooterSection>
        )}

        {/* Contact */}
        {hasContact && (
          <FooterSection>
            <SectionHeader icon={<Phone className="w-4 h-4" />} label="Contact" />
            <div className="flex flex-col gap-2">
              {/* WhatsApp - prominent */}
              {restaurant.contact.whatsapp && (
                <a
                  href={getWhatsAppUrl(
                    restaurant.contact.whatsapp,
                    restaurant.name
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
                  style={{
                    backgroundColor: "#25D366",
                    color: "#FFFFFF",
                    borderRadius: "var(--menu-radius-pill)",
                  }}
                  onClick={() => handleRecord("whatsapp_click")}
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp Us
                </a>
              )}

              {/* Phone */}
              {restaurant.contact.phone && (
                <a
                  href={`tel:${restaurant.contact.phone}`}
                  className="inline-flex items-center gap-2 text-sm hover:opacity-80 transition-opacity"
                  style={{ color: "var(--menu-text-secondary)" }}
                  onClick={() => handleRecord("phone_click")}
                >
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  {restaurant.contact.phone}
                </a>
              )}

              {/* Email */}
              {restaurant.contact.email && (
                <a
                  href={`mailto:${restaurant.contact.email}`}
                  className="inline-flex items-center gap-2 text-sm hover:opacity-80 transition-opacity"
                  style={{ color: "var(--menu-text-secondary)" }}
                >
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  {restaurant.contact.email}
                </a>
              )}
            </div>
          </FooterSection>
        )}

        {/* Social media */}
        {hasSocial && (
          <FooterSection>
            <SectionHeader label="Follow Us" />
            <div className="flex flex-wrap gap-3">
              {restaurant.social.instagram && (
                <SocialLink
                  href={normalizeInstagramUrl(restaurant.social.instagram)}
                  label="Instagram"
                  icon={<Instagram className="w-5 h-5" />}
                  onClick={() => handleRecord("social_click")}
                />
              )}
              {restaurant.social.facebook && (
                <SocialLink
                  href={normalizeFacebookUrl(restaurant.social.facebook)}
                  label="Facebook"
                  icon={<Facebook className="w-5 h-5" />}
                  onClick={() => handleRecord("social_click")}
                />
              )}
              {restaurant.social.tiktok && (
                <SocialLink
                  href={normalizeTikTokUrl(restaurant.social.tiktok)}
                  label="TikTok"
                  icon={<span className="text-sm font-bold">TT</span>}
                  onClick={() => handleRecord("social_click")}
                />
              )}
              {restaurant.social.website && (
                <SocialLink
                  href={normalizeWebsiteUrl(restaurant.social.website)}
                  label="Website"
                  icon={<Globe className="w-5 h-5" />}
                  onClick={() => handleRecord("social_click")}
                />
              )}
            </div>
          </FooterSection>
        )}

        {/* Delivery section */}
        {hasDelivery && (
          <FooterSection>
            <SectionHeader label="Order Delivery" />
            <div className="flex flex-wrap gap-2">
              {delivery!.uberEats && (
                <FooterDeliveryButton
                  href={delivery!.uberEats}
                  label="Uber Eats"
                  brandColor="#06C167"
                  onClick={() => handleRecord("delivery_click")}
                />
              )}
              {delivery!.wolt && (
                <FooterDeliveryButton
                  href={delivery!.wolt}
                  label="Wolt"
                  brandColor="#009de0"
                  onClick={() => handleRecord("delivery_click")}
                />
              )}
              {delivery!.mrD && (
                <FooterDeliveryButton
                  href={delivery!.mrD}
                  label="Mr D"
                  brandColor="#E4002B"
                  onClick={() => handleRecord("delivery_click")}
                />
              )}
              {delivery!.deliveroo && (
                <FooterDeliveryButton
                  href={delivery!.deliveroo}
                  label="Deliveroo"
                  brandColor="#00CCBC"
                  onClick={() => handleRecord("delivery_click")}
                />
              )}
              {delivery!.custom?.map((custom) => (
                <FooterDeliveryButton
                  key={custom.name}
                  href={custom.url}
                  label={custom.name}
                  brandColor={design.accentColor}
                  onClick={() => handleRecord("delivery_click")}
                />
              ))}
            </div>
          </FooterSection>
        )}

        {/* Book a Table */}
        {bookingEnabled && bookingUrl && (
          <FooterSection>
            <a
              href={bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold transition-opacity hover:opacity-90"
              style={{
                backgroundColor: design.accentColor,
                color: getContrastColor(design.accentColor),
                borderRadius: "var(--menu-radius-pill)",
              }}
              onClick={() => handleRecord("booking_click")}
            >
              <Calendar className="w-4 h-4" />
              Book a Table
            </a>
          </FooterSection>
        )}

        {/* Made with MenuMaker — hidden for pro plan */}
        {menu.plan !== "pro" && (
          <div
            className="text-center text-xs pt-4 border-t"
            style={{
              color: "var(--menu-text-muted)",
              borderColor: "var(--menu-border-subtle)",
            }}
          >
            Made with{" "}
            <span className="font-medium" style={{ color: "var(--menu-text-secondary)" }}>
              MenuMaker
            </span>
          </div>
        )}
      </div>
    </footer>
  );
}

/* ---- Helpers ---- */

function FooterSection({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="py-5"
      style={{
        borderBottom: "1px solid var(--menu-border-subtle)",
      }}
    >
      {children}
    </div>
  );
}

function SectionHeader({ icon, label }: { icon?: React.ReactNode; label: string }) {
  return (
    <h3
      className="flex items-center gap-2 mb-3"
      style={{
        color: "var(--menu-text-muted)",
        fontSize: "12px",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.1em",
      }}
    >
      {icon}
      {label}
    </h3>
  );
}

function SocialLink({
  href,
  label,
  icon,
  onClick,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="inline-flex items-center justify-center w-10 h-10 rounded-full transition-opacity hover:opacity-80"
      style={{
        backgroundColor: "var(--menu-surface)",
        color: "var(--menu-primary)",
      }}
      onClick={onClick}
    >
      {icon}
    </a>
  );
}

function FooterDeliveryButton({
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
      className="inline-flex items-center justify-center gap-2 flex-1 min-w-[140px] px-4 py-2.5 text-sm font-bold transition-all hover:opacity-90"
      style={{
        backgroundColor: brandColor,
        color: "#FFFFFF",
        borderRadius: "var(--menu-radius-pill)",
        boxShadow: `0 2px 8px ${brandColor}30`,
      }}
      onClick={onClick}
    >
      {label}
      <ExternalLink className="w-3.5 h-3.5 opacity-70" />
    </a>
  );
}

function buildBookingWhatsAppUrl(number: string, name: string): string {
  const cleaned = number.replace(/\s+/g, "").replace(/[^+\d]/g, "");
  const message = encodeURIComponent(
    "I'd like to book a table at " + name
  );
  return "https://wa.me/" + cleaned + "?text=" + message;
}

function normalizeInstagramUrl(handle: string): string {
  if (handle.startsWith("http")) return handle;
  const cleaned = handle.replace(/^@/, "");
  return `https://instagram.com/${cleaned}`;
}

function normalizeFacebookUrl(handle: string): string {
  if (handle.startsWith("http")) return handle;
  return `https://facebook.com/${handle}`;
}

function normalizeTikTokUrl(handle: string): string {
  if (handle.startsWith("http")) return handle;
  const cleaned = handle.startsWith("@") ? handle : `@${handle}`;
  return `https://tiktok.com/${cleaned}`;
}

function normalizeWebsiteUrl(url: string): string {
  if (url.startsWith("http")) return url;
  return `https://${url}`;
}
