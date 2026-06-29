import { useState, useEffect } from 'react';
import axios from 'axios';
import { Coffee, Cake, Utensils, LayoutGrid, Image, Calendar, Edit2, Trash2, X } from 'lucide-react';
// Importamos la librería de compresión
import imageCompression from 'browser-image-compression'; 
// Importamos tu logo desde los assets
import logoKohTao from '../../assets/logo.png'; 

function AdminDashboard() {
  // 🧭 Estado para controlar qué sección del menú lateral está activa
  const [seccionActiva, setSeccionActiva] = useState('carta');

  // --- ESTADOS PARA GESTIONAR LA CARTA ---
  const [productos, setProductos] = useState([]);
  const [loadingCarta, setLoadingCarta] = useState(true);
  const [categoriaActiva, setCategoriaActiva] = useState('Todos');
  const [idEditar, setIdEditar] = useState(null);
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [categoria, setCategoria] = useState('Cafés');
  const [descripcion, setDescripcion] = useState('');
  const [mensajeCarta, setMensajeCarta] = useState('');

  // --- 🍰 ESTADOS PARA GESTIONAR LAS TARTAS ESPECIALES ---
  const [tartasEspeciales, setTartasEspeciales] = useState([]);
  const [loadingEspeciales, setLoadingEspeciales] = useState(true);
  const [idEditarTarta, setIdEditarTarta] = useState(null);
  const [nombreTarta, setNombreTarta] = useState('');
  const [precioTarta, setPrecioTarta] = useState('');
  const [descripcionTarta, setDescripcionTarta] = useState('');
  const [imagenUrlTarta, setImagenUrlTarta] = useState(''); // Base64
  const [setMensajeTarta] = useState('');

  // --- 📅 ESTADOS PARA GESTIONAR EL PLANO DE RESERVAS ---
  const [reservas, setReservas] = useState([]);
  const [loadingReservas, setLoadingReservas] = useState(true);
  const [mensajeReservas, setMensajeReservas] = useState('');
  
  // Estados del Modal interactivo de mesas
  const [mesaSeleccionada, setMesaSeleccionada] = useState(null); 
  const [mostrarModal, setMostrarModal] = useState(false);
  
  // Campos del formulario para reservar una mesa vacía
  const [nombreCliente, setNombreCliente] = useState('');
  const [personas, setPersonas] = useState('2');
  const [fechaHora, setFechaHora] = useState('');
  const [telefono, setTelefono] = useState('');

  // 🗺️ DISTRIBUCIÓN REAL DE KOH TAO (27 espacios en total - Optimizado)
  const listadoMesas = [
    // 🌿 ZONA TERRAZA (8 Mesas: de la 1 a la 8)
    ...Array.from({ length: 8 }, (_, i) => ({
      numero: i + 1,
      capacidad: 4,
      zona: 'Terraseta Exterior'
    })),
    // ☕ ZONA MESAS / SALÓN (11 Mesas: de la 9 a la 19)
    ...Array.from({ length: 11 }, (_, i) => ({
      numero: i + 9,
      capacidad: [2, 4, 6][i % 3], // Alterna de forma realista capacidades de 2, 4 y 6 personas
      zona: 'Salón Central'
    })),
    // 🥂 ZONA BARRA (8 Espacios/Taburetes: de la 20 a la 27)
    ...Array.from({ length: 8 }, (_, i) => ({
      numero: i + 20,
      capacidad: 1,
      zona: 'Zona Barra Alta'
    }))
  ];

  // 🛠️ FUNCIONES DE CARGA DE DATOS
  const cargarProductos = () => {
    axios.get('http://localhost:5041/api/productos')
      .then(response => {
        setProductos(response.data);
        setLoadingCarta(false);
      })
      .catch(error => {
        console.error("Error al cargar productos:", error);
        setLoadingCarta(false);
      });
  };

  const cargarTartasEspeciales = () => {
    axios.get('http://localhost:5041/api/tartasespeciales')
      .then(response => {
        setTartasEspeciales(response.data);
        setLoadingEspeciales(false);
      })
      .catch(error => {
        console.error("Error al cargar las tartas especiales:", error);
        setLoadingEspeciales(false);
      });
  };

  const cargarReservas = () => {
    setLoadingReservas(true);
    axios.get('http://localhost:5041/api/reservas')
      .then(response => {
        setReservas(response.data);
        setLoadingReservas(false);
      })
      .catch(error => {
        console.error("Error al cargar reservas:", error);
        setLoadingReservas(false);
      });
  };

  // 🔄 INITIAL EFFECT
  useEffect(() => {
    cargarProductos();
    cargarTartasEspeciales();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    cargarReservas();
  }, []);

  // 📝 FORMULARIO CARTA
  const handleSubmitCarta = (e) => {
    e.preventDefault();
    if (!nombre || !precio) {
      setMensajeCarta('❌ Rellena los campos obligatorios.');
      return;
    }

    const datosProducto = {
      id: idEditar ? idEditar : 0,
      nombre: nombre,
      precio: parseFloat(precio),
      categoria: categoria,
      descripcion: descripcion
    };

    if (idEditar) {
      axios.put(`http://localhost:5041/api/productos/${idEditar}`, datosProducto)
        .then(() => {
          setMensajeCarta('✅ ¡Producto actualizado con éxito!');
          reiniciarFormularioCarta();
          cargarProductos();
        })
        .catch(() => setMensajeCarta('❌ Error al actualizar.'));
    } else {
      axios.post('http://localhost:5041/api/productos', datosProducto)
        .then(() => {
          setMensajeCarta('✅ ¡Producto añadido con éxito!');
          reiniciarFormularioCarta();
          cargarProductos();
        })
        .catch(() => setMensajeCarta('❌ Error al añadir.'));
    }
  };

  const handleBorrarCarta = (id) => {
    if (window.confirm('¿Seguro que quieres eliminar este producto de la carta?')) {
      axios.delete(`http://localhost:5041/api/productos/${id}`)
        .then(() => {
          setMensajeCarta('🗑️ Producto eliminado.');
          cargarProductos();
          if (idEditar === id) reiniciarFormularioCarta();
        });
    }
  };

  const iniciarEdicionCarta = (p) => {
    setIdEditar(p.id);
    setNombre(p.nombre);
    setPrecio(p.precio);
    setCategoria(p.categoria);
    setDescripcion(p.descripcion || '');
  };

  const reiniciarFormularioCarta = () => {
    setIdEditar(null);
    setNombre('');
    setPrecio('');
    setCategoria('Cafés');
    setDescripcion('');
    setTimeout(() => setMensajeCarta(''), 3000);
  };

  // 📸 IMAGENES TARTAS
  const manejarCambioImagen = async (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;

    const opciones = { maxSizeMB: 0.3, maxWidthOrHeight: 500, useWebWorker: true };

    try {
      setMensajeTarta('⏳ Comprimiendo imagen...');
      const archivoComprimido = await imageCompression(archivo, opciones);
      const lector = new FileReader();
      lector.onloadend = () => {
        setImagenUrlTarta(lector.result); 
        setMensajeTarta('');
      };
      lector.readAsDataURL(archivoComprimido);
    } catch (error) {
      console.error("Error al comprimir la imagen:", error);
      setMensajeTarta('❌ Error al procesar la imagen.');
    }
  };

  const handleSubmitTarta = (e) => {
    e.preventDefault();
    if (!nombreTarta || !precioTarta) {
      setMensajeTarta('❌ El nombre y el precio son obligatorios.');
      return;
    }

    const datosTarta = {
      id: idEditarTarta ? idEditarTarta : 0,
      nombre: nombreTarta,
      descripcion: descripcionTarta,
      precio: parseFloat(precioTarta),
      imagenUrl: imagenUrlTarta 
    };

    if (idEditarTarta) {
      axios.put(`http://localhost:5041/api/tartasespeciales/${idEditarTarta}`, datosTarta)
        .then(() => {
          setMensajeTarta('✅ ¡Tarta especial actualizada!');
          reiniciarFormularioTarta();
          cargarTartasEspeciales();
        })
        .catch(() => setMensajeTarta('❌ Error al actualizar la tarta.'));
    } else {
      axios.post('http://localhost:5041/api/tartasespeciales', datosTarta)
        .then(() => {
          setMensajeTarta('✅ ¡Tarta especial añadida con éxito!');
          reiniciarFormularioTarta();
          cargarTartasEspeciales();
        })
        .catch(() => setMensajeTarta('❌ Error al añadir la tarta.'));
    }
  };

  const handleBorrarTarta = (id) => {
    if (window.confirm('¿Seguro que quieres eliminar esta tarta de las tentaciones del día?')) {
      axios.delete(`http://localhost:5041/api/tartasespeciales/${id}`)
        .then(() => {
          setMensajeTarta('🗑️ Tarta eliminada correctamente.');
          cargarTartasEspeciales();
          if (idEditarTarta === id) reiniciarFormularioTarta();
        })
        .catch(() => setMensajeTarta('❌ Error al eliminar la tarta.'));
    }
  };

  const iniciarEdicionTarta = (t) => {
    setIdEditarTarta(t.id);
    setNombreTarta(t.nombre || t.titulo);
    setPrecioTarta(t.precio);
    setDescripcionTarta(t.descripcion || '');
    setImagenUrlTarta(t.imagenUrl || t.imagen || '');
  };

  const reiniciarFormularioTarta = () => {
    setIdEditarTarta(null);
    setNombreTarta('');
    setPrecioTarta('');
    setDescripcionTarta('');
    setImagenUrlTarta('');
    const inputFile = document.getElementById('input-archivo-tarta');
    if (inputFile) inputFile.value = '';
    setTimeout(() => setMensajeTarta(''), 3000);
  };

  // --- 📅 LÓGICA INTERACTIVA DE RESERVAS DEL PLANO ---
  const handleMesaClick = (mesa) => {
    const reservaExistente = reservas.find(r => parseInt(r.idMesa || r.mesa || r.numeroMesa) === mesa.numero);
    setMesaSeleccionada({ ...mesa, reserva: reservaExistente });
    
    if (!reservaExistente) {
      setNombreCliente('');
      setPersonas(mesa.capacidad.toString());
      setTelefono('');
      
      const ahora = new Date();
      ahora.setMinutes(ahora.getMinutes() - ahora.getTimezoneOffset());
      setFechaHora(ahora.toISOString().slice(0, 16));
    }
    setMostrarModal(true);
  };

  const handleCrearReserva = (e) => {
    e.preventDefault();
    if (!nombreCliente || !fechaHora) {
      alert('Por favor, rellena el nombre del cliente y la hora.');
      return;
    }

    const nuevaReserva = {
      id: 0,
      nombre: nombreCliente,
      cliente: nombreCliente,
      personas: parseInt(personas),
      telefono: telefono,
      fecha: fechaHora,
      fechaHora: fechaHora,
      idMesa: mesaSeleccionada.numero,
      mesa: mesaSeleccionada.numero
    };

    axios.post('http://localhost:5041/api/reservas', nuevaReserva)
      .then(() => {
        setMensajeReservas(`✅ Mesa ${mesaSeleccionada.numero} reservada con éxito.`);
        setMostrarModal(false);
        cargarReservas();
        setTimeout(() => setMensajeReservas(''), 4000);
      })
      .catch(error => {
        console.error("Error al guardar reserva:", error);
        alert("Error de conexión al guardar la reserva en el servidor.");
      });
  };

  const handleLiberarMesa = (idReserva) => {
    if (window.confirm(`¿Quieres dar por finalizada la estancia de esta mesa y dejarla VACÍA de nuevo?`)) {
      axios.delete(`http://localhost:5041/api/reservas/${idReserva}`)
        .then(() => {
          setMensajeReservas(`🗑️ Mesa liberada correctamente.`);
          setMostrarModal(false);
          cargarReservas();
          setTimeout(() => setMensajeReservas(''), 4000);
        })
        .catch(() => alert('No se pudo borrar la reserva del servidor.'));
    }
  };

  const formatearFecha = (fechaString) => {
    try {
      const opciones = { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' };
      return new Date(fechaString).toLocaleDateString('es-ES', opciones);
    } catch {
      return fechaString;
    }
  };

  const productosFiltrados = productos.filter(p => 
    categoriaActiva === 'Todos' || p.categoria === (categoriaActiva === 'Salados' ? 'Otros' : categoriaActiva)
  );

  // Helper para renderizar cada una de las tarjetas de mesa en formato compacto
  const renderizarTarjetaMesa = (mesa) => {
    const reservaAsociada = reservas.find(r => parseInt(r.idMesa || r.mesa || r.numeroMesa) === mesa.numero);
    const estaOcupada = !!reservaAsociada;

    return (
      <button
        key={mesa.numero}
        onClick={() => handleMesaClick(mesa)}
        className={`p-3.5 rounded-xl border transition-all duration-300 text-left flex flex-col justify-between h-32 shadow-xs relative overflow-hidden group active:scale-95 ${
          estaOcupada 
            ? 'bg-red-50/90 border-red-200 hover:border-red-400' 
            : 'bg-green-50/90 border-green-200 hover:border-green-400'
        }`}
      >
        <div className={`absolute top-0 right-0 py-0.5 px-2 text-[9px] font-extrabold uppercase tracking-wider rounded-bl-lg text-white ${
          estaOcupada ? 'bg-red-600' : 'bg-green-600'
        }`}>
          {estaOcupada ? 'Ocupado' : 'Vacío'}
        </div>

        <div>
          <h3 className="text-xl font-black text-[#4a3319] font-serif">Nº {mesa.numero}</h3>
          <p className="text-[10px] text-gray-500 font-medium mt-0.5">Capacidad: {mesa.capacidad}p</p>
        </div>

        <div className="pt-2 border-t border-gray-100 w-full flex items-center justify-between">
          {estaOcupada ? (
            <div className="overflow-hidden w-full">
              <span className="text-[11px] font-bold text-red-800 block truncate">👤 {reservaAsociada.nombre || reservaAsociada.cliente}</span>
              <span className="text-[9px] text-gray-500 font-mono block">🕒 {formatearFecha(reservaAsociada.fecha || reservaAsociada.fechaHora)}</span>
            </div>
          ) : (
            <span className="text-[10px] font-bold text-green-700 tracking-wide uppercase group-hover:underline">+ Reservar</span>
          )}
        </div>
      </button>
    );
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#fdfbf7] font-sans antialiased text-[#2c2520]">
      
      {/* 📊 BARRA LATERAL IZQUIERDA (SIDEBAR - RESPONSIVE) */}
      <aside className="w-full md:w-72 md:shrink-0 bg-[#4a3319] text-white flex flex-col p-4 md:p-6 shadow-md md:sticky md:top-0 md:h-screen z-10">
        <div className="flex flex-row md:flex-col items-center justify-between md:justify-center gap-4 mb-4 md:mb-8 border-b border-white/10 pb-4 md:pb-6">
          <div className="bg-white rounded-full w-14 h-14 md:w-36 md:h-36 flex items-center justify-center overflow-hidden p-1.5 md:p-3 shadow-inner">
            <img src={logoKohTao} alt="Logo Koh Tao" className="w-full h-full object-contain" />
          </div>
          <span className="text-base md:text-xl font-bold text-[#d4b285] tracking-widest font-serif">KOH TAO PANEL</span>
        </div>

        <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 font-sans scrollbar-none">
          <button onClick={() => setSeccionActiva('carta')} className={`flex items-center gap-3 p-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 whitespace-nowrap text-left shrink-0 md:shrink ${seccionActiva === 'carta' ? 'bg-[#d4b285] text-[#4a3319] shadow-sm' : 'text-white hover:bg-white/10'}`}>
            <LayoutGrid size={16} /> Gestionar Carta
          </button>
          <button onClick={() => setSeccionActiva('especiales')} className={`flex items-center gap-3 p-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 whitespace-nowrap text-left shrink-0 md:shrink ${seccionActiva === 'especiales' ? 'bg-[#d4b285] text-[#4a3319] shadow-md' : 'text-white hover:bg-white/10'}`}>
            <Image size={16} /> Especiales del Día
          </button>
          <button onClick={() => setSeccionActiva('reservas')} className={`flex items-center gap-3 p-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 whitespace-nowrap text-left shrink-0 md:shrink ${seccionActiva === 'reservas' ? 'bg-[#d4b285] text-[#4a3319] shadow-md' : 'text-white hover:bg-white/10'}`}>
            <Calendar size={16} /> Reservas ({reservas.length})
          </button>
        </nav>
      </aside>

      {/* 🖥️ CONTENIDO PRINCIPAL */}
      <main className="flex-grow p-4 md:p-10 font-sans min-w-0 overflow-x-hidden">
        
        {/* SECCIÓN 1: CARTA */}
        {seccionActiva === 'carta' && (
          <div className="animate-[fadeIn_0.2s_ease-out]">
            <h2 className="text-2xl md:text-3xl font-bold text-[#4a3319] mb-6 font-serif">📋 Gestión de la Carta General</h2>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <section className="lg:col-span-5 bg-white border border-[#e6dfd5] rounded-xl overflow-hidden shadow-sm">
                <div className={`p-4 font-bold text-base md:text-lg text-white font-serif tracking-wide ${idEditar ? 'bg-[#d4b285] text-[#4a3319]' : 'bg-[#614424]'}`}>{idEditar ? 'Modificar Producto' : 'Añadir Nuevo Producto'}</div>
                <form onSubmit={handleSubmitCarta} className="p-6 flex flex-col gap-4">
                  <div>
                    <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-[#4a3319]">Nombre del producto *</label>
                    <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej. Flat White" className="w-full p-2.5 rounded-lg border border-[#dcd3c6] focus:outline-none text-sm text-[#2c2520]" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-[#4a3319]">Precio (€) *</label>
                      <input type="number" step="0.01" value={precio} onChange={(e) => setPrecio(e.target.value)} placeholder="0.00" className="w-full p-2.5 rounded-lg border border-[#dcd3c6] text-sm text-[#2c2520]" />
                    </div>
                    <div>
                      <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-[#4a3319]">Categoría</label>
                      <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className="w-full p-2.5 rounded-lg border border-[#dcd3c6] bg-white text-sm text-[#4a3319] font-medium">
                        <option value="Cafés">Cafés</option>
                        <option value="Dulces">Dulces (Tartas)</option>
                        <option value="Otros">Salados / Otros</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-[#4a3319]">Descripción</label>
                    <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Detalles..." rows="3" className="w-full p-2.5 rounded-lg border border-[#dcd3c6] text-sm resize-none text-[#2c2520]" />
                  </div>
                  <div className="flex gap-3 mt-2">
                    <button type="submit" className={`flex-grow p-3 rounded-lg text-xs font-bold text-white uppercase tracking-wider ${idEditar ? 'bg-[#d4b285] text-[#4a3319]' : 'bg-[#614424]'}`}>{idEditar ? 'Guardar Cambios' : 'Guardar en la Carta'}</button>
                    {idEditar && <button type="button" onClick={reiniciarFormularioCarta} className="p-3 bg-gray-100 text-gray-700 font-bold rounded-lg text-xs">Cancelar</button>}
                  </div>
                  {mensajeCarta && <p className={`mt-2 font-bold text-center text-sm ${mensajeCarta.includes('❌') ? 'text-red-600' : 'text-green-600'}`}>{mensajeCarta}</p>}
                </form>
              </section>

              <section className="lg:col-span-7 bg-white border border-[#e6dfd5] rounded-xl overflow-hidden shadow-sm">
                <div className="bg-[#614424] text-white p-4 font-bold text-base md:text-lg font-serif">📋 Productos registrados ({productosFiltrados.length})</div>
                <div className="flex flex-wrap gap-2 p-3 bg-[#fdfbf7] border-b border-gray-100">
                  {['Todos', 'Cafés', 'Dulces', 'Salados'].map(tab => (
                    <button key={tab} onClick={() => setCategoriaActiva(tab)} className={`py-1.5 px-4 rounded-full font-bold text-xs border ${categoriaActiva === tab ? 'bg-[#614424] text-white' : 'bg-white text-[#614424]'}`}>{tab}</button>
                  ))}
                </div>
                <div className="p-4 flex flex-col gap-3 max-h-[500px] overflow-y-auto">
                  {loadingCarta ? <p className="text-center text-gray-400 italic text-sm">Cargando...</p> : productosFiltrados.map(p => (
                    <div key={p.id} className="flex justify-between items-center p-3.5 bg-[#614424] text-white rounded-xl">
                      <div className="flex items-center gap-3 w-8/12">
                        <div className="bg-white/15 p-2 rounded-lg">{p.categoria === 'Cafés' ? <Coffee size={16} className="text-[#d4b285]" /> : p.categoria === 'Dulces' ? <Cake size={16} className="text-[#e6dfd5]" /> : <Utensils size={16} />}</div>
                        <div className="overflow-hidden"><strong className="block text-sm font-semibold truncate text-white">{p.nombre}</strong><span className="text-xs text-[#e6dfd5]/80 block truncate font-normal">{p.descripcion || 'Sin descripción'}</span></div>
                      </div>
                      <div className="flex gap-2 items-center shrink-0">
                        <span className="font-bold text-sm text-[#d4b285] mr-1">{p.precio.toFixed(2)}€</span>
                        <button onClick={() => iniciarEdicionCarta(p)} className="bg-white/20 p-2 rounded-md"><Edit2 size={14} /></button>
                        <button onClick={() => handleBorrarCarta(p.id)} className="bg-red-600 p-2 rounded-md"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        )}

        {/* SECCIÓN 2: ESPECIALES */}
        {seccionActiva === 'especiales' && (
          <div className="animate-[fadeIn_0.2s_ease-out]">
            <h2 className="text-2xl md:text-3xl font-bold text-[#4a3319] mb-6 font-serif">⭐ Gestión de Tartas Especiales</h2>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <section className="lg:col-span-5 bg-white border border-[#e6dfd5] rounded-xl overflow-hidden shadow-sm">
                <div className={`p-4 font-bold text-base md:text-lg text-white font-serif ${idEditarTarta ? 'bg-[#d4b285] text-[#4a3319]' : 'bg-[#4a3319]'}`}>{idEditarTarta ? 'Modificar Tarta Especial' : 'Añadir Nueva Tentación'}</div>
                <form onSubmit={handleSubmitTarta} className="p-6 flex flex-col gap-4">
                  <div>
                    <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-[#4a3319]">Nombre de la Tarta *</label>
                    <input type="text" value={nombreTarta} onChange={(e) => setNombreTarta(e.target.value)} placeholder="Ej. Tarta de Loto" className="w-full p-2.5 rounded-lg border border-[#dcd3c6] text-sm" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-[#4a3319]">Precio (€) *</label>
                      <input type="number" step="0.01" value={precioTarta} onChange={(e) => setPrecioTarta(e.target.value)} placeholder="0.00" className="w-full p-2.5 rounded-lg border border-[#dcd3c6] text-sm" />
                    </div>
                    <div>
                      <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-[#4a3319]">Imagen</label>
                      <input id="input-archivo-tarta" type="file" accept="image/*" onChange={manejarCambioImagen} className="w-full p-1.5 rounded-lg border border-[#dcd3c6] bg-white text-xs cursor-pointer" />
                    </div>
                  </div>
                  <div>
                    <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-[#4a3319]">Descripción</label>
                    <textarea value={descripcionTarta} onChange={(e) => setDescripcionTarta(e.target.value)} placeholder="Detalles..." rows="3" className="w-full p-2.5 rounded-lg border border-[#dcd3c6] text-sm resize-none" />
                  </div>
                  {imagenUrlTarta && <div className="flex flex-col items-center p-2 border border-dashed border-[#dcd3c6] rounded-lg bg-gray-50"><img src={imagenUrlTarta} alt="Prev" className="h-20 object-cover rounded" /></div>}
                  <div className="flex gap-3 mt-2">
                    <button type="submit" className="flex-grow p-3 bg-[#4a3319] hover:bg-[#614424] rounded-lg text-xs font-bold text-white uppercase tracking-wider">Subir Tentación</button>
                    {idEditarTarta && <button type="button" onClick={reiniciarFormularioTarta} className="p-3 bg-gray-100 text-gray-700 font-bold rounded-lg text-xs">Cancelar</button>}
                  </div>
                </form>
              </section>

              <section className="lg:col-span-7 bg-white border border-[#e6dfd5] rounded-xl overflow-hidden shadow-sm">
                <div className="bg-[#4a3319] text-white p-4 font-bold text-base md:text-lg font-serif">🍰 Especiales en Base de Datos ({tartasEspeciales.length})</div>
                <div className="p-4 flex flex-col gap-3 max-h-[500px] overflow-y-auto">
                  {loadingEspeciales ? <p className="text-center text-gray-400 italic text-sm">Cargando...</p> : tartasEspeciales.map(t => (
                    <div key={t.id} className="flex justify-between items-center p-3.5 bg-[#4a3319] text-white rounded-xl">
                      <div className="flex items-center gap-3 w-8/12">
                        <div className="w-12 h-12 overflow-hidden flex items-center justify-center border border-white/20 rounded-lg"><img src={t.imagenUrl || t.imagen || '/default-cake.jpg'} alt="Cake" className="w-full h-full object-cover" /></div>
                        <div className="overflow-hidden"><strong className="block text-sm font-semibold truncate text-white">{t.nombre || t.titulo}</strong><span className="text-xs text-[#e6dfd5]/80 block truncate font-normal">{t.descripcion || 'Sin descripción'}</span></div>
                      </div>
                      <div className="flex gap-2 items-center shrink-0">
                        <span className="font-bold text-sm text-[#d4b285] mr-1">{t.precio.toFixed(2)}€</span>
                        <button onClick={() => iniciarEdicionTarta(t)} className="bg-white/20 p-2 rounded-md"><Edit2 size={14} /></button>
                        <button onClick={() => handleBorrarTarta(t.id)} className="bg-red-600 p-2 rounded-md"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        )}

        {/* SECCIÓN 3: RESERVAS CON MAPA MULTI-ZONA Y DISEÑO ADAPTADO A MÓVIL */}
        {seccionActiva === 'reservas' && (
          <div className="animate-[fadeIn_0.2s_ease-out]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-[#4a3319] font-serif">🗺️ Croquis Plano de Mesas</h2>
                <p className="text-xs md:text-sm text-gray-500 italic mt-0.5 font-sans">Selecciona una mesa o espacio libre para asignar, o pulsa una ocupada para liberarla.</p>
              </div>
              <button onClick={cargarReservas} className="py-2 px-4 bg-white border border-[#e6dfd5] hover:bg-gray-50 text-xs font-bold uppercase tracking-wider text-[#4a3319] rounded-lg shadow-xs transition-colors self-start sm:self-auto">
                🔄 Refrescar Estado
              </button>
            </div>

            {mensajeReservas && (
              <div className={`p-3.5 mb-6 rounded-xl text-center text-sm font-bold border ${mensajeReservas.includes('❌') ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
                {mensajeReservas}
              </div>
            )}

            {loadingReservas ? (
              <p className="text-center text-gray-400 italic text-sm py-16">Cargando la disposición física de las mesas...</p>
            ) : (
              <div className="flex flex-col gap-8">
                
                {/* 🌿 SUB-SECCIÓN: TERRAZA */}
                <div className="bg-white border border-[#e6dfd5] p-4 rounded-xl shadow-xs">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#614424] mb-3 border-b border-gray-100 pb-2 flex items-center gap-2">
                    🌿 Terraseta Exterior <span className="bg-amber-100 text-[#4a3319] px-2 py-0.5 rounded-full text-[10px]">{listadoMesas.filter(m => m.zona === 'Terraseta Exterior').length} Mesas</span>
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {listadoMesas.filter(m => m.zona === 'Terraseta Exterior').map(renderizarTarjetaMesa)}
                  </div>
                </div>

                {/* ☕ SUB-SECCIÓN: SALÓN CENTRAL */}
                <div className="bg-white border border-[#e6dfd5] p-4 rounded-xl shadow-xs">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#614424] mb-3 border-b border-gray-100 pb-2 flex items-center gap-2">
                    ☕ Salón Interior <span className="bg-amber-100 text-[#4a3319] px-2 py-0.5 rounded-full text-[10px]">{listadoMesas.filter(m => m.zona === 'Salón Central').length} Mesas</span>
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {listadoMesas.filter(m => m.zona === 'Salón Central').map(renderizarTarjetaMesa)}
                  </div>
                </div>

                {/* 🥂 SUB-SECCIÓN: BARRA */}
                <div className="bg-white border border-[#e6dfd5] p-4 rounded-xl shadow-xs">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#614424] mb-3 border-b border-gray-100 pb-2 flex items-center gap-2">
                    🥂 Taburetes de Barra Alta <span className="bg-amber-100 text-[#4a3319] px-2 py-0.5 rounded-full text-[10px]">{listadoMesas.filter(m => m.zona === 'Zona Barra Alta').length} Espacios</span>
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {listadoMesas.filter(m => m.zona === 'Zona Barra Alta').map(renderizarTarjetaMesa)}
                  </div>
                </div>

                {/* Resumen Informativo inferior */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 bg-white p-4 border border-[#e6dfd5] rounded-xl text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-green-600 rounded-full inline-block"></span> 
                    Espacios Disponibles ({listadoMesas.length - reservas.length})
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-red-600 rounded-full inline-block"></span> 
                    Espacios Ocupados ({reservas.length} / {listadoMesas.length})
                  </div>
                </div>
              </div>
            )}

            {/* 🚪 MODAL DINÁMICO COMPLETAMENTE INTEGRADO Y OPTIMIZADO PARA MÓVILES */}
            {mostrarModal && mesaSeleccionada && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-[fadeIn_0.15s_ease-out]">
                <div className="bg-white rounded-xl border border-[#e6dfd5] shadow-xl w-full max-w-md overflow-hidden animate-[scaleUp_0.2s_ease-out] max-h-[90vh] flex flex-col">
                  
                  {/* Encabezado del Modal */}
                  <div className={`p-4 text-white font-serif font-bold text-base flex items-center justify-between ${
                    mesaSeleccionada.reserva ? 'bg-red-700' : 'bg-[#4a3319]'
                  }`}>
                    <span>Mesa {mesaSeleccionada.numero} — {mesaSeleccionada.zona}</span>
                    <button onClick={() => setMostrarModal(false)} className="text-white/80 hover:text-white transition-colors"><X size={20} /></button>
                  </div>

                  {/* Cuerpo del modal */}
                  <div className="p-5 overflow-y-auto flex-1 font-sans text-sm">
                    {mesaSeleccionada.reserva ? (
                      /* CASO A: LA MESA ESTÁ OCUPADA -> MOSTRAR RESUMEN */
                      <div>
                        <div className="bg-red-50 border border-red-100 p-4 rounded-xl mb-5">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-red-800 mb-2.5">Detalles de la ocupación:</h4>
                          <div className="flex flex-col gap-2 text-gray-700">
                            <p><strong>Cliente:</strong> {mesaSeleccionada.reserva.nombre || mesaSeleccionada.reserva.cliente}</p>
                            <p><strong>Comensales:</strong> {mesaSeleccionada.reserva.personas} personas</p>
                            {mesaSeleccionada.reserva.telefono && <p><strong>Teléfono:</strong> {mesaSeleccionada.reserva.telefono}</p>}
                            <p><strong>Fecha/Hora:</strong> {formatearFecha(mesaSeleccionada.reserva.fecha || mesaSeleccionada.reserva.fechaHora)}</p>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <button 
                            onClick={() => handleLiberarMesa(mesaSeleccionada.reserva.id)}
                            className="w-full p-3 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
                          >
                            ✓ Atendida (Marcar como Vacía)
                          </button>
                          <button 
                            onClick={() => setMostrarModal(false)}
                            className="w-full p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
                          >
                            Volver al Plano
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* CASO B: LA MESA ESTÁ VACÍA -> MOSTRAR FORMULARIO */
                      <form onSubmit={handleCrearReserva} className="flex flex-col gap-4">
                        <div>
                          <label className="block mb-1 text-xs font-bold uppercase tracking-wider text-[#4a3319]">Nombre del Cliente *</label>
                          <input 
                            type="text" 
                            required
                            value={nombreCliente} 
                            onChange={(e) => setNombreCliente(e.target.value)} 
                            placeholder="Ej. Juan Pérez" 
                            className="w-full p-2 rounded-lg border border-[#dcd3c6] text-sm"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block mb-1 text-xs font-bold uppercase tracking-wider text-[#4a3319]">Personas</label>
                            <select 
                              value={personas} 
                              onChange={(e) => setPersonas(e.target.value)}
                              className="w-full p-2 rounded-lg border border-[#dcd3c6] bg-white text-sm"
                            >
                              {Array.from({ length: mesaSeleccionada.capacidad }, (_, idx) => (
                                <option key={idx + 1} value={idx + 1}>{idx + 1} {idx === 0 ? 'persona' : 'personas'}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block mb-1 text-xs font-bold uppercase tracking-wider text-[#4a3319]">Teléfono</label>
                            <input 
                              type="tel" 
                              value={telefono} 
                              onChange={(e) => setTelefono(e.target.value)} 
                              placeholder="Opcional" 
                              className="w-full p-2 rounded-lg border border-[#dcd3c6] text-sm"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block mb-1 text-xs font-bold uppercase tracking-wider text-[#4a3319]">Fecha y Hora de la Reserva *</label>
                          <input 
                            type="datetime-local" 
                            required
                            value={fechaHora} 
                            onChange={(e) => setFechaHora(e.target.value)} 
                            className="w-full p-2 rounded-lg border border-[#dcd3c6] text-sm text-[#4a3319]"
                          />
                        </div>

                        <div className="flex gap-2 pt-2">
                          <button 
                            type="submit" 
                            className="flex-grow p-3 bg-green-700 hover:bg-green-800 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
                          >
                            Ocupar / Confirmar
                          </button>
                          <button 
                            type="button" 
                            onClick={() => setMostrarModal(false)}
                            className="p-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-bold transition-colors"
                          >
                            Cancelar
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

      </main>
    </div>
  );
}

export default AdminDashboard;