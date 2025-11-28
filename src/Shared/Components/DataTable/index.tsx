import React, { useState, useMemo, useRef, useEffect } from 'react';
// @mui Components
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Pagination, Box, Typography, type SxProps, type Theme } from '@mui/material';
import { styled } from '@mui/system';
// @mui Icons
import { ExpandLess, ExpandMore, UnfoldMore } from '@mui/icons-material';
import { SelectPerPage } from './SelectPerPage';
import { InputSearch } from './InputSearch';

interface Column {
  header: string | React.ReactNode;
  accessor: string;
  width?: number | string;
  order?: boolean;
  renderCell?: (row: Record<string, any>) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  rows: Record<string, any>[];
  bodyHeight?: number | string;
  sx?: SxProps<Theme>;
  controllerSx?: SxProps<Theme>;
  headerCellSx?: SxProps<Theme>;
  bodyCellSx?: SxProps<Theme>;
  paginationSx?: SxProps<Theme>;
  stickyColumns?: string[];
  withAccesor?: { key: string, value: number }[]
}

const defaultStyles: {
  sx: SxProps<Theme>;
  controllerSx: SxProps<Theme>;
  headerCellSx: SxProps<Theme>;
  bodyCellSx: SxProps<Theme>;
  paginationSx: SxProps<Theme>;
} = {
  sx: {
    backgroundColor: '#ffffff',
  },
  controllerSx: {
    margin: '20px 16px 10px 16px',
  },
  headerCellSx: {
    backgroundColor: '#ffffff',
    fontSize: '11px',
    fontWeight: 'bold',
    padding: '8px 16px',
    textTransform: 'uppercase'
  },
  bodyCellSx: {
    color: '#333',
    fontSize: '12px',
    padding: '8px 16px',
  },
  paginationSx: {
    margin: '10px 16px',
  },
};

const DataTable: React.FC<DataTableProps> = ({
  columns,
  rows,
  bodyHeight,
  sx = defaultStyles.sx,
  controllerSx = defaultStyles.controllerSx,
  headerCellSx = defaultStyles.headerCellSx,
  bodyCellSx = defaultStyles.bodyCellSx,
  paginationSx = defaultStyles.paginationSx,
  stickyColumns = [],
  withAccesor = []
}) => {
  const [search, setSearch] = useState('');
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setPage(1); // Reset to the first page on search
  };

  const handlePerPageChange = (selectedOption: any) => {
    setPerPage(selectedOption.value);
    setPage(1); // Reset to the first page on per page change
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    event.target;
    setPage(value);
  };

  const handleSort = (accessor: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === accessor && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key: accessor, direction });
  };

  const filteredRows = useMemo(() => {
    if (!search.trim()) return rows;

    return rows.filter(row =>
      columns.some(column => {
        if (["check", "acciones"].includes(column.accessor)) return false; // Ignorar JSX que no tiene texto

        const cellValue = row[column.accessor];

        if (cellValue == null) return false;

        // Verificar si es un React Element antes de acceder a sus props
        if (React.isValidElement(cellValue)) {
          const element = cellValue as React.ReactElement;
        
          const props = element.props as { children?: React.ReactNode };
        
          if (typeof props.children === "string") {
            return props.children.toLowerCase().includes(search.toLowerCase());
          }
        
          if (Array.isArray(props.children)) {
            const extractedText = props.children
              .filter((child: React.ReactNode) => typeof child === "string")
              .join(" ");
            return extractedText.toLowerCase().includes(search.toLowerCase());
          }
        
          return false;
        }

        return String(cellValue).toLowerCase().includes(search.toLowerCase());
      })
    );
  }, [search, rows, columns]);

  const getSortableValue = (value: any): string | number => {
    if (React.isValidElement(value)) {
      const element = value as React.ReactElement;
      const props = element.props as { children?: React.ReactNode };
  
      if (typeof props.children === "string" || typeof props.children === "number") {
        return props.children;
      }
  
      if (Array.isArray(props.children)) {
        return props.children
          .filter((child: React.ReactNode) => typeof child === "string" || typeof child === "number")
          .join(" ");
      }
  
      return "";
    }
  
    return typeof value === "string" || typeof value === "number" ? value : "";
  };
  
  const sortedRows = useMemo(() => {
    if (!sortConfig) return filteredRows;
  
    return [...filteredRows].sort((a, b) => {
      const aValue = getSortableValue(a[sortConfig.key]);
      const bValue = getSortableValue(b[sortConfig.key]);
  
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredRows, sortConfig]);

  const paginatedRows = useMemo(() => {
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    return sortedRows.slice(startIndex, endIndex);
  }, [sortedRows, page, perPage]);

  const perPageOptions = [
    { value: 5, label: '5' },
    { value: 10, label: '10' },
    { value: 20, label: '20' },
    { value: 50, label: '50' },
    { value: 100, label: '100' },
  ];

  const totalRows = filteredRows.length;
  const fromRow = totalRows === 0 ? 0 : (page - 1) * perPage + 1;
  const toRow = Math.min(page * perPage, totalRows);

  const StyledTableRow = styled(TableRow)({
    '&:nth-of-type(odd)': {
      backgroundColor: '#F5F6F8',
    },
  });

  const tableContainerStyles: SxProps<Theme> = bodyHeight
    ? { height: bodyHeight, overflowY: 'auto', borderRadius: 0, boxShadow: 'none' }
    : { borderRadius: 0, boxShadow: 'none' };

  const containerRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        setIsScrolled(containerRef.current.scrollLeft > 0);
      }
    };

    const current = containerRef.current;
    if (current) {
      current.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (current) {
        current.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  const renderTableHeaders = () => {
    let sumWidth = 0;

    return columns.map((column, index) => {
      const isSticky = stickyColumns.includes(column.accessor);
      let valueWidth = 0;

      if (isSticky && index > 0) {
        valueWidth = withAccesor[index - 1]?.value ?? 0;
        sumWidth = sumWidth + valueWidth;
      } else {
        sumWidth = 0;
      }

      return (
        <TableCell
          key={index}
          sx={{
            ...headerCellSx,
            minWidth: column.width || 'auto',
            cursor: column.order !== false ? 'pointer' : 'default',
            position: 'sticky',
            left: (isSticky && paginatedRows.length > 0) ? `${sumWidth}px` : 'auto',
            zIndex: isSticky ? 3 : 2,
            boxShadow: (isScrolled && isSticky && paginatedRows.length > 0) ? "2px 0 4px rgba(0,0,0,0.2)" : "none",
          }}
          onClick={column.order !== false ? () => handleSort(column.accessor) : undefined}
        >
          <Box sx={{ display: 'flex' }}>
            <Box>
              {column.header}
            </Box>
            <Box>
              {typeof column.header === 'string' && column.order !== false && (
                sortConfig?.key === column.accessor ? (
                  sortConfig.direction === 'asc' ? (
                    <ExpandMore fontSize="small" />
                  ) : (
                    <ExpandLess fontSize="small" />
                  )
                ) : (
                  <UnfoldMore fontSize="small" style={{ opacity: 0 }} />
                )
              )}
            </Box>
          </Box>
        </TableCell>
      )
    })
  };

  return (
    <Box sx={sx}>
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={controllerSx}>
        <Box display="flex" alignItems="center">
          <Typography sx={{ marginRight: '4px', fontSize: '14px' }}>Mostrar</Typography>
          <SelectPerPage
            defaultValue={perPageOptions[1]}
            options={perPageOptions}
            onChange={handlePerPageChange}
          />
          <Typography sx={{ marginLeft: '4px', fontSize: '14px' }}>Registros</Typography>
        </Box>
        <InputSearch
          onChange={handleSearchChange}
          value={search}
          placeholder="Buscar"
        />
      </Box>
      <Paper sx={{ width: '100%', display: "table", tableLayout: "fixed" }}>
        <TableContainer
          ref={containerRef}
          sx={tableContainerStyles}
        >
          <Table stickyHeader size="small" aria-label="a dense table">
            <TableHead style={{ display: 'table-header-group' }}>
              <TableRow>
                {renderTableHeaders()}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRows.length > 0
                ? paginatedRows.map((row, rowIndex) => {
                  let sumWidth = 0;
                  return (
                    <StyledTableRow key={rowIndex}>
                      {columns.map((column, colIndex) => {
                        const isSticky = stickyColumns.includes(column.accessor);
                        //const valueWidth = withAccesor.find((E) => E.key === column.accessor)?.value

                        let valueWidth = 0;

                        if (isSticky && colIndex > 0) {
                          valueWidth = withAccesor[colIndex - 1]?.value ?? 0;
                          sumWidth = sumWidth + valueWidth;
                        } else {
                          sumWidth = 0;
                        }

                        return (
                          <TableCell
                            key={colIndex}
                            sx={{
                              ...bodyCellSx,
                              minWidth: column.width || 'auto',
                              position: isSticky ? 'sticky' : 'static',
                              left: isSticky ? `${sumWidth}px` : 'auto',
                              zIndex: isSticky ? 1 : 0,
                              backgroundColor: '#ffffff',
                              boxShadow: (isScrolled && isSticky) ? "3px 0 5px  rgba(0,0,0,0.2)" : "none",
                            }}
                          >
                            {row[column.accessor]}
                          </TableCell>
                        );
                      })}
                    </StyledTableRow>
                  )
                })
                : (
                  <StyledTableRow>
                    <TableCell colSpan={columns.length} sx={{ textAlign: 'center' }}>
                      {"Sin resultados"}
                    </TableCell>
                  </StyledTableRow>
                )
              }
            </TableBody>
          </Table>
        </TableContainer>
        <Box display="flex" justifyContent="space-between" alignItems="center" sx={paginationSx}>
          <Typography variant="body2" sx={{ fontSize: '14px' }}>
            {fromRow} - {toRow} de {totalRows} registros
          </Typography>
          <Pagination
            count={Math.ceil(totalRows / perPage)}
            page={page}
            onChange={handlePageChange}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default DataTable;
