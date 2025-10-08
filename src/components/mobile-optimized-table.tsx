

'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  Filter, 
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Download,
  Upload,
  Plus
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface MobileTableColumn {
  key: string;
  label: string;
  type?: 'text' | 'badge' | 'number' | 'currency' | 'date';
  primary?: boolean;
  secondary?: boolean;
}

interface MobileTableAction {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: (item: any) => void;
  variant?: 'default' | 'destructive' | 'secondary';
}

interface MobileOptimizedTableProps {
  data: any[];
  columns: MobileTableColumn[];
  actions?: MobileTableAction[];
  searchable?: boolean;
  filterable?: boolean;
  filterOptions?: { value: string; label: string }[];
  onAdd?: () => void;
  onExport?: () => void;
  onImport?: () => void;
  title?: string;
  emptyMessage?: string;
}

export default function MobileOptimizedTable({
  data,
  columns,
  actions = [],
  searchable = true,
  filterable = false,
  filterOptions = [],
  onAdd,
  onExport,
  onImport,
  title,
  emptyMessage = "No hay datos disponibles"
}: MobileOptimizedTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  
  // Get primary and secondary columns
  const primaryColumn = columns.find(col => col.primary);
  const secondaryColumns = columns.filter(col => col.secondary);
  const otherColumns = columns.filter(col => !col.primary && !col.secondary);
  
  // Filter data based on search and filter
  const filteredData = data.filter(item => {
    const matchesSearch = searchable ? 
      Object.values(item).some(value => 
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      ) : true;
    
    const matchesFilter = filter === 'all' || !filterable ? true : 
      item[filterOptions.find(opt => opt.value === filter)?.value || 'status'] === filter;
    
    return matchesSearch && matchesFilter;
  });

  const formatValue = (value: any, type?: string) => {
    if (value === null || value === undefined) return '-';
    
    switch (type) {
      case 'currency':
        return new Intl.NumberFormat('es-CO', {
          style: 'currency',
          currency: 'COP',
          minimumFractionDigits: 0
        }).format(value);
      case 'number':
        return new Intl.NumberFormat('es-CO').format(value);
      case 'date':
        return new Date(value).toLocaleDateString('es-CO');
      default:
        return String(value);
    }
  };

  const renderBadge = (value: string, type?: string) => {
    if (type !== 'badge') return formatValue(value, type);
    
    // Default badge styling based on common status values
    const getBadgeVariant = (status: string) => {
      const lowerStatus = status.toLowerCase();
      if (lowerStatus.includes('activ') || lowerStatus.includes('libre') || lowerStatus.includes('confirmad')) {
        return 'default';
      }
      if (lowerStatus.includes('ocupad') || lowerStatus.includes('pendiente')) {
        return 'secondary';
      }
      if (lowerStatus.includes('cancelad') || lowerStatus.includes('mantenimiento')) {
        return 'destructive';
      }
      return 'outline';
    };

    return (
      <Badge variant={getBadgeVariant(value)} className="text-xs">
        {value}
      </Badge>
    );
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      {(title || searchable || filterable || onAdd || onExport || onImport) && (
        <div className="space-y-3">
          {title && (
            <h2 className="text-lg font-semibold">{title}</h2>
          )}
          
          {/* Search and Filter Row */}
          <div className="flex flex-col sm:flex-row gap-3">
            {searchable && (
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            )}
            
            {filterable && filterOptions.length > 0 && (
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filtrar..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {filterOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Action Buttons */}
          {(onAdd || onExport || onImport) && (
            <div className="flex flex-wrap gap-2">
              {onAdd && (
                <Button onClick={onAdd} size="sm" className="flex-1 sm:flex-initial">
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar
                </Button>
              )}
              {onExport && (
                <Button onClick={onExport} variant="outline" size="sm" className="flex-1 sm:flex-initial">
                  <Download className="mr-2 h-4 w-4" />
                  Exportar
                </Button>
              )}
              {onImport && (
                <Button onClick={onImport} variant="outline" size="sm" className="flex-1 sm:flex-initial">
                  <Upload className="mr-2 h-4 w-4" />
                  Importar
                </Button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Mobile Cards View */}
      <div className="space-y-3">
        {filteredData.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8 text-center">
              <div className="text-muted-foreground text-sm">{emptyMessage}</div>
            </CardContent>
          </Card>
        ) : (
          filteredData.map((item, index) => (
            <Card key={index} className="relative">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0 space-y-2">
                    {/* Primary Information */}
                    {primaryColumn && (
                      <div className="font-medium text-foreground">
                        {formatValue(item[primaryColumn.key], primaryColumn.type)}
                      </div>
                    )}
                    
                    {/* Secondary Information */}
                    {secondaryColumns.length > 0 && (
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        {secondaryColumns.map((column) => (
                          <div key={column.key} className="flex items-center gap-1">
                            <span className="text-xs font-medium">{column.label}:</span>
                            {renderBadge(item[column.key], column.type)}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Additional Information */}
                    {otherColumns.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-sm">
                        {otherColumns.map((column) => (
                          <div key={column.key} className="flex justify-between">
                            <span className="text-muted-foreground text-xs">{column.label}:</span>
                            <span className="font-medium">
                              {renderBadge(item[column.key], column.type)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Actions */}
                  {actions.length > 0 && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 ml-2">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {actions.map((action, actionIndex) => (
                          <DropdownMenuItem
                            key={actionIndex}
                            onClick={() => action.onClick(item)}
                            className={action.variant === 'destructive' ? 'text-destructive' : ''}
                          >
                            <action.icon className="mr-2 h-4 w-4" />
                            {action.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Results Count */}
      {filteredData.length > 0 && (
        <div className="text-center text-sm text-muted-foreground">
          Mostrando {filteredData.length} de {data.length} elementos
        </div>
      )}
    </div>
  );
}
