interface PlanCardProps {
  title: string
  description: string
  image: string
  onModify?: () => void
}

const PlanCard = ({ title, description, image, onModify }: PlanCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border w-full">
      <img
        src={image}
        alt={title}
        className="w-full h-50 object-cover rounded-xl p-2"
      />
      <div className="px-4 py-4">
        <h3 className="font-semibold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
        <button
          onClick={onModify}
          className="mt-3 w-full py-2 border rounded-md text-sm font-medium hover:bg-gray-100"
        >
          Modify Plan
        </button>
      </div>
    </div>
  )
}

export default PlanCard
