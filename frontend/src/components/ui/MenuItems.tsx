import { useLocation } from "react-router-dom";
import { type MenuItem } from "../../hooks/useMenu"

function MenuItems(item: MenuItem) {
    const location = useLocation();
    // Verifica si la ruta actual coincide con el path del item
    const isActive = item.path && location.pathname === item.path;

    return (
        <button
            onClick={item.onClick}
            className={`flex items-center space-x-2 w-full py-2 px-3 rounded-lg transition cursor-pointer
            ${isActive ? "bg-indigo-100 text-indigo-700 font-semibold" : "text-gray-700 hover:text-indigo-600"}`}
        >
            {item.icon}
            <span>{item.label}</span>
        </button>
    )
}

export default MenuItems;