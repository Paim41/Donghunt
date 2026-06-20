// Fullscreen looping video wallpaper (desktop/mobile variants picked natively
// via <source media="..."> on the <video> element) + the same readability
// gradient overlay the old static .app-bg used.
export default function BackgroundVideo() {
  return (
    <div className="fixed inset-0 -z-20 overflow-hidden bg-[#0b0f1a]">
      <video
        className="h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        <source src="/bg/bg-desktop.mp4" media="(min-width: 768px)" type="video/mp4" />
        <source src="/bg/bg-mobile.mp4" type="video/mp4" />
      </video>
      {/* gradient overlay for text readability, same as before */}
      <div className="absolute inset-0 bg-gradient-to-b from-[rgba(11,15,26,0.75)] via-[rgba(11,15,26,0.92)] to-[#0b0f1a]" />
    </div>
  );
}
