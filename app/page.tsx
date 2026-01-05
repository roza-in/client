import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center py-32 px-16 bg-white dark:bg-black sm:items-start">
        <h1 className="text-5xl font-extrabold text-zinc-900 dark:text-white sm:text-6xl">
          Welcome to <span className="text-blue-600">Rozx</span>
        </h1>
        <p className="text-lg ml-12 mt-2 text-zinc-700 dark:text-zinc-300 sm:text-xl">
          Digital Solutions for Hospitals & Clinics in India
        </p>
      </main>
    </div>
  );
}
