const LoadingAnimation: React.FC = () => (
    <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
)

export const LoadingScreen: React.FC = () => (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex flex-col justify-center items-center z-50">
        <LoadingAnimation />
        <p className="text-white mt-4 text-lg">Initializing PHOENIX...</p>
    </div>
)