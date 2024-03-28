import "./flight-skeleton.css"

const FlightSkeleton = () => {
    return (
        <div className="bg-white w-full cursor-pointer rounded-md shadow-md mt-4 p-2 box-border border border-gray-100 hover:border-blue-400 transition-all">
    <div className="flex justify-between">
      <div>
        <div className="flex justify-start items-center">
          <div className="skeleton-image"></div>
          <div className="skeleton-text ml-2"></div>
        </div>
        <div className="flex items-center rounded-full px-2 p-py w-fit cursor-pointer hover:bg-gray-100 transition-all">
          <div className="skeleton-icon"></div>
          <div className="skeleton-text ml-2"></div>
        </div>
      </div>

      <div className="flex justify-between">
        <div>
          <div className="skeleton-text"></div>
          <div className="skeleton-text font-medium"></div>
        </div>

        <div className="mx-2">
          <div className="skeleton-text-block"></div>
          <div className="skeleton-text-block"></div>
        </div>

        <div>
          <div className="skeleton-text"></div>
          <div className="skeleton-text font-medium"></div>
        </div>
      </div>

      <div>
        <div className="skeleton-text text-end text-xs line-through text-gray-600"></div>
        <div className="skeleton-text text-end text-lg text-orange-500 font-semibold"></div>
      </div>
    </div>

    <div className="flex justify-between items-end mt-2">
      <div className="skeleton-tags">
        <div className="skeleton-tag"></div>
        <div className="skeleton-tag"></div>
      </div>

      <div className="skeleton-button"></div>
    </div>
  </div>
    )
}

export default FlightSkeleton