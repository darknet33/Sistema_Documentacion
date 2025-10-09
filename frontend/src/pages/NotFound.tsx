import {Link} from 'react-router-dom'; // Assuming you're using Next.js or a similar routing library

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="text-center max-w-lg mx-auto">
        {/* Gran Título 404 con un efecto de glitch o una fuente impactante */}
        <h1 className="text-9xl font-extrabold text-indigo-600 dark:text-indigo-400 mb-4 tracking-widest">
          404
        </h1>

        {/* Mensaje principal */}
        <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          ¡Ups! Página No Encontrada
        </h2>

        {/* Mensaje secundario y explicación amigable */}
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          Parece que te has desviado del camino. La página que buscas no existe o se ha movido.
          No te preocupes, esto le pasa hasta al mejor explorador. 🧭
        </p>

        {/* Botones de acción principales */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          
          {/* Botón principal: Volver al Inicio */}
          {/* Se usa el componente Link para una navegación rápida sin recargar */}
          <Link
            to="/"
            className="px-6 py-3 text-lg font-semibold rounded-lg shadow-md transition duration-300 ease-in-out bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-500 dark:hover:bg-indigo-600"
          >
            Volver al Inicio 🏠
          </Link>
          
          {/* Botón secundario: Contacto/Ayuda */}
          <Link
            to="/contacto"
            className="px-6 py-3 text-lg font-semibold rounded-lg transition duration-300 ease-in-out border border-gray-300 dark:border-gray-700 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Reportar un Problema 🛠️
          </Link>
        </div>
        
        {/* Opcional: Pequeña imagen o ilustración */}
        {/*  */}
        
      </div>
    </div>
  )
}