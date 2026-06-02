export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-8 py-10">
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}
