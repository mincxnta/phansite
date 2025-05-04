import { useTranslation } from 'react-i18next';

export const Pagination = ({ page, totalPages, onPageChange, isLoading = false }) => {
  const { t } = useTranslation();

  return (
    <div className="mt-8 text-white text-xl">
      <div className="relative inline-block">
        <div
          className="absolute -bottom-1 left-[3px] right-[-3px] h-[calc(100%+2px)] bg-white transform -rotate-3 z-0"
          aria-hidden="true"
        ></div>
        <div
          className="z-10 bg-red-600 px-3 py-1 -rotate-3"
        >
          <button
            onClick={() => onPageChange(Math.max(page - 1, 1))}
            disabled={page === 1 || isLoading}
            className={`${
              page === 1 || isLoading ? 'opacity-40 cursor-not-allowed' : 'hover:opacity-75'
            }`}
          >
            {"←"}
          </button>
          <span className="select-none text-2xl px-2">
            {t('pagination', { page, totalPages })}
          </span>
          <button
            onClick={() => onPageChange(Math.min(page + 1, totalPages))}
            disabled={page === totalPages || isLoading}
            className={`p-1 ${
              page === totalPages || isLoading ? 'opacity-40 cursor-not-allowed' : 'hover:opacity-75'
            }`}
          >
            {"→"}
          </button>
        </div>
      </div>
    </div>
  );
};