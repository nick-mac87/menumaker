'use client';

import { useEffect, useRef, useCallback } from 'react';

interface QRCodeProps {
  url: string;
  color?: string;
  logo?: string;
  size?: number;
  className?: string;
}

export default function QRCode({ url, color = '#000000', logo, size = 256, className }: QRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawQR = useCallback(async () => {
    if (!canvasRef.current) return;

    // Dynamic import to avoid SSR issues
    const QRCodeStyling = (await import('qr-code-styling')).default;

    const qr = new QRCodeStyling({
      width: size,
      height: size,
      data: url,
      dotsOptions: {
        color: color,
        type: 'rounded',
      },
      cornersSquareOptions: {
        type: 'extra-rounded',
        color: color,
      },
      cornersDotOptions: {
        type: 'dot',
        color: color,
      },
      backgroundOptions: {
        color: '#FFFFFF',
      },
      imageOptions: {
        crossOrigin: 'anonymous',
        margin: 8,
        imageSize: 0.3,
      },
      ...(logo ? { image: logo } : {}),
    });

    // Clear canvas
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, size, size);
    }

    // QR code styling appends to DOM, we'll use a temp container
    const tempDiv = document.createElement('div');
    qr.append(tempDiv);

    // Wait a moment for rendering
    setTimeout(() => {
      const svgOrCanvas = tempDiv.querySelector('canvas') || tempDiv.querySelector('svg');
      if (svgOrCanvas && ctx) {
        if (svgOrCanvas instanceof HTMLCanvasElement) {
          ctx.drawImage(svgOrCanvas, 0, 0);
        }
      }
      tempDiv.remove();
    }, 100);
  }, [url, color, logo, size]);

  useEffect(() => {
    drawQR();
  }, [drawQR]);

  return <canvas ref={canvasRef} width={size} height={size} className={className} />;
}

export async function downloadQRCode(
  url: string,
  color: string = '#000000',
  logo?: string,
  filename: string = 'menu-qr-code.png'
): Promise<void> {
  const QRCodeStyling = (await import('qr-code-styling')).default;

  const qr = new QRCodeStyling({
    width: 1024,
    height: 1024,
    data: url,
    dotsOptions: {
      color: color,
      type: 'rounded',
    },
    cornersSquareOptions: {
      type: 'extra-rounded',
      color: color,
    },
    cornersDotOptions: {
      type: 'dot',
      color: color,
    },
    backgroundOptions: {
      color: '#FFFFFF',
    },
    imageOptions: {
      crossOrigin: 'anonymous',
      margin: 8,
      imageSize: 0.3,
    },
    ...(logo ? { image: logo } : {}),
  });

  qr.download({ name: filename.replace('.png', ''), extension: 'png' });
}
