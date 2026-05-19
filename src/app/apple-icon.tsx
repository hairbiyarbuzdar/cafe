import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/**
 * iOS home-screen icon. Apple ignores SVG `apple-touch-icon`s and
 * insists on a raster PNG, so we generate one via next/og at the
 * canonical 180×180 size. The rest of the platforms use the
 * vector `app/icon.svg`.
 */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#6B4423",
          color: "#FFF6E5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 96,
          fontWeight: 700,
          letterSpacing: -4,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        B
      </div>
    ),
    { ...size },
  );
}
