import { useState } from 'react'
import { Search, X } from 'lucide-react'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'

interface SearchBarProps {
  onSearch?: (query: string) => void
  placeholder?: string
}

export default function SearchBar({ 
  onSearch, 
  placeholder = "Buscar cursos, instructores, categorías..."
}: SearchBarProps) {
  const [query, setQuery] = useState('')

  const handleSearch = () => {
    if (query.trim() && onSearch) {
      onSearch(query.trim())
    }
  }

  const clearSearch = () => {
    setQuery('')
  }

  return (
    <div className="relative">
      <div className="relative">
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          className="pl-12 pr-20 py-4 text-lg"
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
          {query && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="px-2"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
          
          <Button onClick={handleSearch} size="sm">
            Buscar
          </Button>
        </div>
      </div>
    </div>
  )
}