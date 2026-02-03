import SearchBar from './SearchBar';
import ContactGrid from './ContactGrid';
import ContactList from './ContactList';
import Loading from '../common/Loading';

const ArchiveView = ({
  contacts,
  loading,
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  sortField,
  sortDirection,
  onSortChange,
  onToggleFavorite,
}) => {
  return (
    <div className="space-y-6">
      {/* Search & Filter Bar */}
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        viewMode={viewMode}
        onViewModeChange={onViewModeChange}
        sortField={sortField}
        sortDirection={sortDirection}
        onSortChange={onSortChange}
      />

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {loading ? 'Loading...' : `${contacts.length} contact${contacts.length !== 1 ? 's' : ''}`}
          {searchQuery && ` matching "${searchQuery}"`}
        </p>
      </div>

      {/* Content */}
      {loading ? (
        <div className="py-12">
          <Loading text="Loading contacts..." />
        </div>
      ) : viewMode === 'grid' ? (
        <ContactGrid contacts={contacts} onToggleFavorite={onToggleFavorite} />
      ) : (
        <ContactList contacts={contacts} onToggleFavorite={onToggleFavorite} />
      )}
    </div>
  );
};

export default ArchiveView;
