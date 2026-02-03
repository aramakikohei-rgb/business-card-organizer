import { useState } from 'react';
import { Link } from 'react-router-dom';
import ArchiveView from '../components/Archive/ArchiveView';
import Button from '../components/common/Button';
import { useContacts } from '../context/ContactContext';
import { useToast } from '../components/common/Toast';
import { downloadExcel, downloadCSV, exportAllToVCard } from '../utils/exporters';

const Archive = () => {
  const {
    filteredContacts,
    contacts,
    loading,
    searchQuery,
    setSearchQuery,
    viewMode,
    setViewMode,
    sortField,
    sortDirection,
    setSort,
  } = useContacts();

  const toast = useToast();
  const [showExportMenu, setShowExportMenu] = useState(false);

  const handleExport = (format) => {
    const contactsToExport = filteredContacts.length > 0 ? filteredContacts : contacts;

    if (contactsToExport.length === 0) {
      toast.warning('No contacts to export');
      setShowExportMenu(false);
      return;
    }

    try {
      switch (format) {
        case 'excel':
          downloadExcel(contactsToExport);
          toast.success(`Exported ${contactsToExport.length} contacts to Excel`);
          break;
        case 'csv':
          downloadCSV(contactsToExport);
          toast.success(`Exported ${contactsToExport.length} contacts to CSV`);
          break;
        case 'vcard':
          exportAllToVCard(contactsToExport);
          toast.success(`Exported ${contactsToExport.length} contacts to vCard`);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export contacts');
    }

    setShowExportMenu(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Contact Archive
        </h1>
        <div className="flex items-center space-x-3">
          {/* Export Dropdown */}
          <div className="relative">
            <Button
              variant="secondary"
              onClick={() => setShowExportMenu(!showExportMenu)}
              disabled={contacts.length === 0}
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Export
              <svg
                className="w-4 h-4 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </Button>

            {showExportMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowExportMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20">
                  <div className="py-1">
                    <button
                      onClick={() => handleExport('excel')}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                    >
                      <svg
                        className="w-5 h-5 mr-3 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      Excel (.xlsx)
                    </button>
                    <button
                      onClick={() => handleExport('csv')}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                    >
                      <svg
                        className="w-5 h-5 mr-3 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      CSV (.csv)
                    </button>
                    <button
                      onClick={() => handleExport('vcard')}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                    >
                      <svg
                        className="w-5 h-5 mr-3 text-purple-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                        />
                      </svg>
                      vCard (.vcf)
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          <Link to="/scan">
            <Button>
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Contact
            </Button>
          </Link>
        </div>
      </div>

      {/* Archive View */}
      <ArchiveView
        contacts={filteredContacts}
        loading={loading}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        sortField={sortField}
        sortDirection={sortDirection}
        onSortChange={setSort}
      />
    </div>
  );
};

export default Archive;
