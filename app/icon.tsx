import { ImageResponse } from "next/og";

export const size = {
  width: 512,
  height: 512,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "512px",
          height: "512px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #2563EB 0%, #06B6D4 100%)",
          borderRadius: "104px",
        }}
      >
        <svg width="360" height="360" viewBox="0 0 512 512" fill="none">
          <path d="M145 189L205 249L145 309" stroke="white" strokeWidth="34" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M232 323H335" stroke="white" strokeWidth="34" strokeLinecap="round" />
          <circle cx="326" cy="165" r="25" fill="white" />
          <circle cx="326" cy="347" r="25" fill="white" />
          <circle cx="384" cy="256" r="25" fill="white" />
          <path d="M326 190V218C326 239 343 256 364 256H384" stroke="white" strokeWidth="24" strokeLinecap="round" />
          <path d="M326 322V294C326 273 343 256 364 256H384" stroke="white" strokeWidth="24" strokeLinecap="round" />
        </svg>
      </div>
    ),
    size
  );
}
