export default function LightButton({ onClick, children }: React.PropsWithChildren<{ onClick: () => void }>) {
    return (<button data-modal-target="popup-modal" data-modal-toggle="popup-modal" type="button" onClick={onClick} className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
        {
            children
        }
    </button>)
}