export default function RefreshButton({ onRefresh }) {
    return (
        <button
            onClick={onRefresh}
            className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
        >
            🔄 Rafraîchir
        </button>
    );
}
