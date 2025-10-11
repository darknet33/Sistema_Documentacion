si porfavor procede con el fronten

define el types/estudiante.ts
crear el api/estudiantes.ts
crear useEstudiantes.ts
luego en la carpeta components/table/EstudianteTable.tsx (opcional para cada modulo si lo nesecita)
luego en la carpeta components/table/EstudianteForm.tsx (opcional para cada modulo si lo nesecita)

ten en cuenta que para los componentes al momento de importar lo hacemos desde un archivos index.js

// src/components/index.ts

// Forms
export { LoginForm } from "./forms/LoginForm";
export { UserForm } from "./forms/UserForm";
export { ProfileForm } from "./forms/ProfileForm";
export { CurseForm } from "./forms/CurseForm";
export { DocumentForm } from "./forms/DocumentForm";

// Panels

export { DocumentosRequeridosPanel } from "./panel/DocumentosRequeridosPanel"

// Tables
export { UserTable } from "./tables/UserTable";
export { CurseTable } from "./tables/CurseTable";
export { DocumentTable } from "./tables/DocumentTable";

// Cards

export { ProfileCard } from "./cards/ProfileCard"

// UI
export { LoadingScreen } from "./ui/LoadingScreen";
export { Sidebar } from "./ui/Sidebar";
export { Notification } from "./ui/Notification"
export { LogoutButton } from "./ui/LogoutButton"

crea un pages/estudiantes (opcional si es un modulo o una subconsultas que puede ser tranquilo un panel)

tambien el crea un componetne de busqueda de estudiantes tambien el table tiene que contar con paginacion y limite (opcional para cada modulo)

agregar en en routes/AppRoutes.tsx

<Route
    path="/estudiantes"
    element={
        <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Estudiantes />
        </ProtectedRoute>
    }
/>

y modificar el useMenu.tsx