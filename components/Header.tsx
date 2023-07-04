export function Header() {
  return (
    <div className="w-full h-11 top-0 z-10 fixed backdrop-blur-md bg-white/30 flex items-center">
      <div className="my-auto menu cursor-pointer">
        <svg width="24" height="24">
          <path
            d="M5 6h14M5 12h14M5 18h14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          ></path>
        </svg>
      </div>
      <div className="logo">
        <span className="mx-2 text-black">BoothLike</span>
      </div>
      <div className="my-auto search ml-auto mx-2 cursor-pointer">
        <svg
          width="24"
          height="24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m19 19-3.5-3.5"></path>
          <circle cx="11" cy="11" r="6"></circle>
        </svg>
      </div>
    </div>
  );
}
