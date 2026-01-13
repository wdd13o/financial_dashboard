export default function PowerOffIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M13 3H11V13H13V3M17.83 5.17L16.41 6.59C17.88 8.06 18.84 10.01 18.84 12.18C18.84 16.24 15.53 19.55 11.47 19.55C7.41 19.55 4.1 16.24 4.1 12.18C4.1 10.01 5.06 8.06 6.53 6.59L5.11 5.17C3.29 7.25 2.1 9.99 2.1 13.04C2.1 17.89 6.03 21.82 10.88 21.82C15.73 21.82 19.66 17.89 19.66 13.04C19.66 9.99 18.47 7.25 16.65 5.17H17.83Z" />
    </svg>
  );
}
