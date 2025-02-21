import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

interface DataTablePaginationProps {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    onPageChange: (page: number) => void;
}

export function DataTablePagination({
    currentPage,
    pageSize,
    totalItems,
    onPageChange,
}: DataTablePaginationProps) {
    const totalPages = Math.ceil(totalItems / pageSize);

    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;
        
        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) {
                    pages.push(i);
                }
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                pages.push(1);
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i);
                }
                pages.push(totalPages);
            }
        }
        
        return pages;
    };

    if (totalPages <= 1) return null;

    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious 
                        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                </PaginationItem>
                
                {getPageNumbers().map((pageNumber, index, array) => (
                    <PaginationItem key={pageNumber}>
                        {index > 0 && pageNumber - array[index - 1] > 1 ? (
                            <>
                                <PaginationLink className="pointer-events-none">...</PaginationLink>
                                <PaginationLink
                                    onClick={() => onPageChange(pageNumber)}
                                    isActive={pageNumber === currentPage}
                                    className="cursor-pointer"
                                >
                                    {pageNumber}
                                </PaginationLink>
                            </>
                        ) : (
                            <PaginationLink
                                onClick={() => onPageChange(pageNumber)}
                                isActive={pageNumber === currentPage}
                                className="cursor-pointer"
                            >
                                {pageNumber}
                            </PaginationLink>
                        )}
                    </PaginationItem>
                ))}
                
                <PaginationItem>
                    <PaginationNext
                        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
                        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}
