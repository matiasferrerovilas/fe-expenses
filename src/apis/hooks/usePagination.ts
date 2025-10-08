import { useCallback, useState } from "react";

export function usePagination(initialPage: number = 0) {
  const [page, setPage] = useState(initialPage);

  const nextPage = useCallback(() => {
    setPage((p) => p + 1);
  }, []);

  const prevPage = useCallback(() => {
    setPage((p) => Math.max(p - 1, 0));
  }, []);

  const goToPage = useCallback((p: number) => setPage(Math.max(p, 0)), []);

  const resetPage = useCallback(() => {
    setPage(initialPage);
  }, [initialPage]);

  return {
    page,
    nextPage,
    prevPage,
    resetPage,
    goToPage,
    canGoPrev: page > 0,
  };
}
