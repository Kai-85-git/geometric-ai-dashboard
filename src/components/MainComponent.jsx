import React from "react";

function MainComponent() {
  const [folders, setFolders] = React.useState([]);
  const [bookmarks, setBookmarks] = React.useState([]);
  const [darkMode, setDarkMode] = React.useState(false);
  const [compactView, setCompactView] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("");
  const [showAddBookmarkModal, setShowAddBookmarkModal] = React.useState(false);
  const [showAddFolderModal, setShowAddFolderModal] = React.useState(false);

  React.useEffect(() => {
    const storedFolders = JSON.parse(localStorage.getItem("folders")) || [];
    const storedBookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
    const storedDarkMode =
      JSON.parse(localStorage.getItem("darkMode")) || false;
    const storedCompactView =
      JSON.parse(localStorage.getItem("compactView")) || false;

    setFolders(storedFolders);
    setBookmarks(storedBookmarks);
    setDarkMode(storedDarkMode);
    setCompactView(storedCompactView);
  }, []);

  React.useEffect(() => {
    localStorage.setItem("folders", JSON.stringify(folders));
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    localStorage.setItem("compactView", JSON.stringify(compactView));
  }, [folders, bookmarks, darkMode, compactView]);

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleCompactView = () => setCompactView(!compactView);

  const addFolder = (folderName) => {
    setFolders([
      ...folders,
      { id: Date.now(), name: folderName, bookmarks: [] },
    ]);
  };

  const addBookmark = (bookmark) => {
    setBookmarks([
      ...bookmarks,
      { ...bookmark, id: Date.now(), useCount: 0, lastUsed: null },
    ]);
  };

  const deleteFolder = (folderId) => {
    setFolders(folders.filter((folder) => folder.id !== folderId));
  };

  const deleteBookmark = (bookmarkId) => {
    setBookmarks(bookmarks.filter((bookmark) => bookmark.id !== bookmarkId));
  };

  const openBookmark = (bookmarkId) => {
    const updatedBookmarks = bookmarks.map((bookmark) => {
      if (bookmark.id === bookmarkId) {
        return {
          ...bookmark,
          useCount: bookmark.useCount + 1,
          lastUsed: new Date(),
        };
      }
      return bookmark;
    });
    setBookmarks(updatedBookmarks);
    const bookmarkToOpen = bookmarks.find(
      (bookmark) => bookmark.id === bookmarkId
    );
    window.open(bookmarkToOpen.url, "_blank");
  };

  const filteredBookmarks = bookmarks.filter(
    (bookmark) =>
      bookmark.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory === "" || bookmark.category === selectedCategory)
  );

  const topBookmarks = bookmarks
    .sort((a, b) => b.useCount - a.useCount)
    .slice(0, 5);

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      <header className="p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">AI Tool Bookmark Manager</h1>
        <div className="flex space-x-4 text-[#000000]">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <i className={`fas ${darkMode ? "fa-sun" : "fa-moon"}`}></i>
          </button>
          <button
            onClick={toggleCompactView}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <i
              className={`fas ${compactView ? "fa-expand" : "fa-compress"}`}
            ></i>
          </button>
        </div>
      </header>

      <main className={`p-4 ${compactView ? "space-y-2" : "space-y-4"}`}>
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="ブックマークを検索..."
            className="flex-grow border rounded h-[50px] p-[9px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="p-2 border rounded"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">全てのカテゴリ</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="border rounded p-4">
            <h2 className="text-xl font-bold mb-2">フォルダ</h2>
            <button
              onClick={() => setShowAddFolderModal(true)}
              className="mb-2 bg-blue-500 text-white p-2 rounded"
            >
              フォルダを追加
            </button>
            {folders.map((folder) => (
              <div key={folder.id} className="mb-2">
                <h3 className="font-semibold">{folder.name}</h3>
                <button
                  onClick={() => deleteFolder(folder.id)}
                  className="text-red-500"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            ))}
          </div>

          <div className="border rounded p-4">
            <h2 className="text-xl font-bold mb-2">ブックマーク</h2>
            <button
              onClick={() => setShowAddBookmarkModal(true)}
              className="mb-2 bg-green-500 text-white p-2 rounded"
            >
              ブックマークを追加
            </button>
            {filteredBookmarks.map((bookmark) => (
              <div key={bookmark.id} className="mb-2">
                <a
                  href="#"
                  onClick={() => openBookmark(bookmark.id)}
                  className="text-blue-500 hover:underline"
                >
                  {bookmark.name}
                </a>
                <button
                  onClick={() => deleteBookmark(bookmark.id)}
                  className="ml-2 text-red-500"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            ))}
          </div>

          <div className="border rounded p-4">
            <h2 className="text-xl font-bold mb-2">よく使うツール</h2>
            {topBookmarks.map((bookmark) => (
              <div key={bookmark.id} className="mb-2">
                <a
                  href="#"
                  onClick={() => openBookmark(bookmark.id)}
                  className="text-blue-500 hover:underline"
                >
                  {bookmark.name}
                </a>
                <span className="ml-2 text-sm text-gray-500">
                  使用回数: {bookmark.useCount}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>

      {showAddFolderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded">
            <h2 className="text-xl font-bold mb-2">フォルダを追加</h2>
            <input
              type="text"
              placeholder="フォルダ名"
              className="p-2 border rounded mb-2"
            />
            <button
              onClick={() => setShowAddFolderModal(false)}
              className="bg-blue-500 text-white p-2 rounded"
            >
              追加
            </button>
            <button
              onClick={() => setShowAddFolderModal(false)}
              className="ml-2 text-gray-500"
            >
              キャンセル
            </button>
          </div>
        </div>
      )}

      {showAddBookmarkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded">
            <h2 className="text-xl font-bold mb-2">ブックマークを追加</h2>
            <input
              type="text"
              placeholder="名前"
              className="p-2 border rounded mb-2 w-full"
            />
            <input
              type="url"
              placeholder="URL"
              className="p-2 border rounded mb-2 w-full"
            />
            <input
              type="text"
              placeholder="カテゴリ"
              className="p-2 border rounded mb-2 w-full"
            />
            <input
              type="text"
              placeholder="タグ（カンマ区切り）"
              className="p-2 border rounded mb-2 w-full"
            />
            <button
              onClick={() => setShowAddBookmarkModal(false)}
              className="bg-green-500 text-white p-2 rounded"
            >
              追加
            </button>
            <button
              onClick={() => setShowAddBookmarkModal(false)}
              className="ml-2 text-gray-500"
            >
              キャンセル
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MainComponent;