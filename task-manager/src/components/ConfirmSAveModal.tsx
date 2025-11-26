interface ConfirmSaveModalProps {
  OnConfirm: () => void;
  OnCancel: () => void;
}

const ConfirmSaveModal = ({ OnConfirm, OnCancel }: ConfirmSaveModalProps) => {
  return(
    <div className="fixed bg-black/50 insert-0 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-[300px] text-center">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Save Task
            </h2>

            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                Do you want to save this task?
            </p>

            <div className="flex justify-between mt-5">
                <button onClick={OnCancel}
                className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-600 dark:text-fray-100"> No </button>

                <button onClick={OnConfirm}
                className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"> Yes </button>   
            </div>
        </div>
    </div>
  );
};

export default ConfirmSaveModal;