export const InternalError = () => {
  return (
    <section className="flex h-screen w-screen flex-col items-center justify-center gap-5">
      <h2 className="px-4 text-center text-4xl font-medium">Ops... Tivemos um erro</h2>
      <p className="px-4 text-center text-xl">Tente novamente mais tarde</p>

      <img src="/images/internal-error.png" className="mt-5 w-[320px]" />
    </section>
  )
}
