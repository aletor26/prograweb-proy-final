import React from "react";

const UserDetailView = ({ user }: { user: any }) => {
  let nombre = user.nombre;
  let apellido = user.apellido;
  if ((!nombre || !apellido) && user.name) {
    const partes = user.name.split(" ");
    nombre = partes[0];
    apellido = partes.slice(1).join(" ");
  }

  return (
    <ul>
      <li><b>ID:</b> {user.id}</li>
      <li><b>Nombre:</b> {nombre}</li>
      <li><b>Apellido:</b> {apellido}</li>
      <li><b>Email:</b> {user.email}</li>
      <li><b>Rol:</b> {user.role === "admin" ? "Administrador" : "Cliente"}</li>
      <li><b>Estado:</b> {user.activo === false ? "Inactivo" : "Activo"}</li>
      {user.dni && <li><b>DNI:</b> {user.dni}</li>}
      {user.createdAt && <li><b>Fecha de registro:</b> {new Date(user.createdAt).toLocaleDateString()}</li>}
    </ul>
  );
};

export default UserDetailView;
