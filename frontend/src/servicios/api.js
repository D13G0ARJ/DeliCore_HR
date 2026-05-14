const API_URL = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000/api'

export async function obtenerAccesoDemo() {
  const respuesta = await fetch(`${API_URL}/acceso-demo`)

  if (!respuesta.ok) {
    throw new Error('No fue posible cargar los perfiles de acceso.')
  }

  return respuesta.json()
}

export async function obtenerPanelGeneral() {
  const respuesta = await fetch(`${API_URL}/panel-general`)

  if (!respuesta.ok) {
    throw new Error('No fue posible obtener el panel general.')
  }

  return respuesta.json()
}

export async function obtenerDirectorioEmpleados() {
  const respuesta = await fetch(`${API_URL}/directorio-empleados`)

  if (!respuesta.ok) {
    throw new Error('No fue posible obtener el directorio de empleados.')
  }

  return respuesta.json()
}

export async function obtenerGestionUsuarios() {
  const respuesta = await fetch(`${API_URL}/gestion-usuarios`)

  if (!respuesta.ok) {
    throw new Error('No fue posible obtener la gestion de usuarios.')
  }

  return respuesta.json()
}

export async function obtenerPerfilTalento({ empleadoId } = {}) {
  const url = new URL(`${API_URL}/perfil-talento`)

  if (empleadoId) {
    url.searchParams.set('empleado_id', empleadoId)
  }

  const respuesta = await fetch(url)

  if (!respuesta.ok) {
    throw new Error('No fue posible obtener el perfil de talento.')
  }

  return respuesta.json()
}

export async function obtenerCentroKpis({ empleadoId } = {}) {
  const url = new URL(`${API_URL}/centro-kpis`)

  if (empleadoId) {
    url.searchParams.set('empleado_id', empleadoId)
  }

  const respuesta = await fetch(url)

  if (!respuesta.ok) {
    throw new Error('No fue posible obtener el centro de KPIs.')
  }

  return respuesta.json()
}

export async function crearKpi(datos) {
  const respuesta = await fetch(`${API_URL}/centro-kpis/definiciones`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(datos),
  })

  if (!respuesta.ok) {
    throw new Error('No fue posible crear el KPI.')
  }

  return respuesta.json()
}

export async function crearEmpleadoAdmin(datos) {
  const respuesta = await fetch(`${API_URL}/gestion-usuarios/empleados`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(datos),
  })

  if (!respuesta.ok) {
    throw new Error('No fue posible crear el usuario.')
  }

  return respuesta.json()
}

export async function actualizarEmpleadoAdmin(id, datos) {
  const respuesta = await fetch(`${API_URL}/gestion-usuarios/empleados/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(datos),
  })

  if (!respuesta.ok) {
    throw new Error('No fue posible actualizar el usuario.')
  }

  return respuesta.json()
}

export async function actualizarSeguimientoKpi(id, datos) {
  const respuesta = await fetch(`${API_URL}/centro-kpis/seguimientos/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(datos),
  })

  if (!respuesta.ok) {
    throw new Error('No fue posible actualizar el seguimiento KPI.')
  }

  return respuesta.json()
}

export async function obtenerAsistenteIaRol(idioma = 'es') {
  const respuesta = await fetch(`${API_URL}/asistente-ia-rol?idioma=${idioma}`)

  if (!respuesta.ok) {
    throw new Error('No fue posible obtener el asistente IA por rol.')
  }

  return respuesta.json()
}

export async function consultarAsistenteIaRol({ puestoId, pregunta, idioma = 'es' }) {
  const respuesta = await fetch(`${API_URL}/asistente-ia-rol/consultar`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      puesto_id: puestoId,
      pregunta,
      idioma,
    }),
  })

  if (!respuesta.ok) {
    throw new Error('No fue posible obtener el asistente IA por rol.')
  }

  return respuesta.json()
}

export async function obtenerOrganigrama() {
  const respuesta = await fetch(`${API_URL}/organigrama`)

  if (!respuesta.ok) {
    throw new Error('No fue posible obtener el organigrama.')
  }

  return respuesta.json()
}
