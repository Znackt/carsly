interface PlanCardProps {
  title: string
  description: string
  image?: string
  onModify?: () => void
}

const PlanCard = ({ title, description, image, onModify }: PlanCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border w-full flex flex-col overflow-hidden h-full">
      <div className="w-full h-[180px] bg-gray-50 flex-shrink-0">
        {image ? (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            No Image
          </div>
        )}
      </div>

      <div className="px-4 py-4 flex flex-col flex-1">
        <h3 className="font-semibold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-500 mb-4">{description}</p>
        
        {/* mt-auto pushes the button to the bottom so cards stay equal height */}
        <button
          onClick={onModify}
          className="mt-auto w-full py-2 border border-gray-200 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors"
        >
          Modify Plan
        </button>
      </div>
      
    </div>
  )
}

export default PlanCard