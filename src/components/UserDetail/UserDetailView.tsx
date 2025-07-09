import './UserDetailView.css';

const UserDetailView = ({ user }: { user: any }) => {
  let nombre = user.nombre;
  let apellido = user.apellido;
  if ((!nombre || !apellido) && user.name) {
    const partes = user.name.split(" ");
    nombre = partes[0];
    apellido = partes.slice(1).join(" ");
  }

  return (
    <div className="user-detail-card">
      <div className="user-detail-title">Detalle de Usuario</div>
      <ul className="user-detail-info">
        <li><span className="user-detail-label">ID:</span> <span className="user-detail-value">{user.id}</span></li>
        <li><span className="user-detail-label">Nombre:</span> <span className="user-detail-value">{nombre}</span></li>
        <li><span className="user-detail-label">Apellido:</span> <span className="user-detail-value">{apellido}</span></li>
        <li><span className="user-detail-label">Email:</span> <span className="user-detail-value">{user.email}</span></li>
        <li><span className="user-detail-label">Rol:</span> <span className="user-detail-value">{user.role === "admin" ? "Administrador" : "Cliente"}</span></li>
        <li><span className="user-detail-label">Estado:</span> <span className="user-detail-value">{user.activo === false ? "Inactivo" : "Activo"}</span></li>
        {user.dni && <li><span className="user-detail-label">DNI:</span> <span className="user-detail-value">{user.dni}</span></li>}
        {user.createdAt && <li><span className="user-detail-label">Fecha de registro:</span> <span className="user-detail-value">{new Date(user.createdAt).toLocaleDateString()}</span></li>}
      </ul>
    </div>
  );
};

export default UserDetailView;
