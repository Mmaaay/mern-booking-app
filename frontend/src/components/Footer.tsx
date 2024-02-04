
const Footer = () => {
  return (
    <div className="bg-blue-800 py-8">
        <div className="container mx-auto flex flex-row justify-between items-center">
            <span className="text-xl text-white font-bold tracking-tight">MernHolidays</span>
            <span className="text-white text-xs font-bold tracking-tight flex gap-4">
                <p className="cursor-pointer">Privacy Policy</p>
                <p className="cursor-pointer">Terms of service</p>
            </span>

        </div>
    </div>
  )
}

export default Footer