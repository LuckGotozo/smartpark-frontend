import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [authMode, setAuthMode] = useState('login')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')

  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const [token, setToken] = useState(localStorage.getItem('token'))
  const [userName, setUserName] = useState(
    localStorage.getItem('userName') || ''
  )

  const [currentPage, setCurrentPage] = useState('dashboard')

  const [vehicles, setVehicles] = useState([])
  const [vehiclesLoading, setVehiclesLoading] = useState(false)
  const [vehiclesError, setVehiclesError] = useState('')

  const [showVehicleForm, setShowVehicleForm] = useState(false)
  const [vehicleSaving, setVehicleSaving] = useState(false)
  const [vehicleFormError, setVehicleFormError] = useState('')

  const [plate, setPlate] = useState('')
  const [brand, setBrand] = useState('')
  const [model, setModel] = useState('')
  const [color, setColor] = useState('')

  const [parkingLots, setParkingLots] = useState([])
  const [parkingLotsLoading, setParkingLotsLoading] = useState(false)
  const [parkingLotsError, setParkingLotsError] = useState('')

  const [parkingSpots, setParkingSpots] = useState([])
  const [parkingSpotsLoading, setParkingSpotsLoading] = useState(false)
  const [parkingSpotsError, setParkingSpotsError] = useState('')

  const [reservations, setReservations] = useState([])
  const [reservationsLoading, setReservationsLoading] = useState(false)
  const [reservationsError, setReservationsError] = useState('')

  const [showReservationForm, setShowReservationForm] = useState(false)
  const [reservationSaving, setReservationSaving] = useState(false)
  const [reservationFormError, setReservationFormError] = useState('')

  const [reservationVehicleId, setReservationVehicleId] = useState('')
  const [reservationSpotId, setReservationSpotId] = useState('')
  const [reservationStartTime, setReservationStartTime] = useState('')
  const [reservationEndTime, setReservationEndTime] = useState('')

  useEffect(() => {
  if (!token) {
    return
  }

  async function loadDashboardData() {
    try {
      const headers = {
        Authorization: `Bearer ${token}`
      }

      const [
        vehiclesResponse,
        parkingLotsResponse,
        parkingSpotsResponse,
        reservationsResponse
      ] = await Promise.all([
        fetch('http://localhost:8080/api/vehicles/me', {
          headers
        }),

        fetch('http://localhost:8080/api/parking-lots', {
          headers
        }),

        fetch('http://localhost:8080/api/parking-spots', {
          headers
        }),

        fetch('http://localhost:8080/api/reservations/me', {
          headers
        })
      ])

      if (
        vehiclesResponse.status === 401 ||
        parkingLotsResponse.status === 401 ||
        parkingSpotsResponse.status === 401 ||
        reservationsResponse.status === 401
      ) {
        localStorage.removeItem('token')
        localStorage.removeItem('userName')

        setToken(null)
        setUserName('')

        return
      }

      if (vehiclesResponse.ok) {
        setVehicles(await vehiclesResponse.json())
      }

      if (parkingLotsResponse.ok) {
        setParkingLots(await parkingLotsResponse.json())
      }

      if (parkingSpotsResponse.ok) {
        setParkingSpots(await parkingSpotsResponse.json())
      }

      if (reservationsResponse.ok) {
        setReservations(await reservationsResponse.json())
      }
    } catch (error) {
      console.error(
        'Erro ao carregar o dashboard:',
        error
      )
    }
  }

  loadDashboardData()
}, [token])

  async function handleLogin(event) {
    event.preventDefault()

    setMessage('')
    setLoading(true)

    try {
      const response = await fetch(
        'http://localhost:8080/api/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email,
            password
          })
        }
      )

      const data = await response.json()

      if (!response.ok) {
        setMessage(data.message || 'E-mail ou senha inválidos')
        return
      }

      localStorage.setItem('token', data.token)
      localStorage.setItem('userName', data.name)

      setToken(data.token)
      setUserName(data.name)

      setEmail('')
      setPassword('')
      setMessage('')
    } catch (error) {
      console.error(error)
      setMessage('Não foi possível conectar ao servidor')
    } finally {
      setLoading(false)
    }
  }

  async function handleRegister(event) {
    event.preventDefault()

    setMessage('')
    setLoading(true)

    try {
      const response = await fetch(
        'http://localhost:8080/api/auth/register',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            password
          })
        }
      )

      const data = await response.json()

      if (!response.ok) {
        if (data.errors) {
          const firstError = Object.values(data.errors)[0]
          setMessage(firstError)
        } else {
          setMessage(data.message || 'Não foi possível criar a conta')
        }

        return
      }

      setName('')
      setEmail('')
      setPassword('')

      setAuthMode('login')
      setMessage('Conta criada com sucesso. Agora faça login.')
    } catch (error) {
      console.error(error)
      setMessage('Não foi possível conectar ao servidor')
    } finally {
      setLoading(false)
    }
  }

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('userName')

    setToken(null)
    setUserName('')
    setCurrentPage('dashboard')

    setVehicles([])
    setParkingLots([])
    setParkingSpots([])
    setReservations([])
  }

  async function loadVehicles() {
    setCurrentPage('vehicles')
    setVehiclesLoading(true)
    setVehiclesError('')

    try {
      const response = await fetch(
        'http://localhost:8080/api/vehicles/me',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (response.status === 401) {
        handleLogout()
        return
      }

      if (!response.ok) {
        setVehiclesError('Não foi possível carregar os veículos')
        return
      }

      const data = await response.json()
      setVehicles(data)
    } catch (error) {
      console.error(error)
      setVehiclesError('Erro ao conectar com o servidor')
    } finally {
      setVehiclesLoading(false)
    }
  }

  function openVehicleForm() {
    setVehicleFormError('')
    setShowVehicleForm(true)
  }

  function closeVehicleForm() {
    setShowVehicleForm(false)
    setVehicleFormError('')
    setPlate('')
    setBrand('')
    setModel('')
    setColor('')
  }

  async function handleCreateVehicle(event) {
    event.preventDefault()

    setVehicleSaving(true)
    setVehicleFormError('')

    try {
      const response = await fetch(
        'http://localhost:8080/api/vehicles/me',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            plate: plate.trim().toUpperCase(),
            brand: brand.trim(),
            model: model.trim(),
            color: color.trim()
          })
        }
      )

      if (response.status === 401) {
        handleLogout()
        return
      }

      if (!response.ok) {
        let errorMessage = 'Não foi possível cadastrar o veículo'

        try {
          const errorData = await response.json()

          if (errorData.message) {
            errorMessage = errorData.message
          }
        } catch {
          //
        }

        setVehicleFormError(errorMessage)
        return
      }

      closeVehicleForm()
      await loadVehicles()
    } catch (error) {
      console.error(error)
      setVehicleFormError('Erro ao conectar com o servidor')
    } finally {
      setVehicleSaving(false)
    }
  }

  async function loadParkingLots() {
    setCurrentPage('parkingLots')
    setParkingLotsLoading(true)
    setParkingLotsError('')

    try {
      const response = await fetch(
        'http://localhost:8080/api/parking-lots',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (response.status === 401) {
        handleLogout()
        return
      }

      if (!response.ok) {
        setParkingLotsError(
          'Não foi possível carregar os estacionamentos'
        )
        return
      }

      const data = await response.json()
      setParkingLots(data)
    } catch (error) {
      console.error(error)
      setParkingLotsError('Erro ao conectar com o servidor')
    } finally {
      setParkingLotsLoading(false)
    }
  }

  async function loadParkingSpots() {
    setCurrentPage('parkingSpots')
    setParkingSpotsLoading(true)
    setParkingSpotsError('')

    try {
      const response = await fetch(
        'http://localhost:8080/api/parking-spots',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (response.status === 401) {
        handleLogout()
        return
      }

      if (!response.ok) {
        setParkingSpotsError('Não foi possível carregar as vagas')
        return
      }

      const data = await response.json()
      setParkingSpots(data)
    } catch (error) {
      console.error(error)
      setParkingSpotsError('Erro ao conectar com o servidor')
    } finally {
      setParkingSpotsLoading(false)
    }
  }

  async function loadReservations() {
    setCurrentPage('reservations')
    setReservationsLoading(true)
    setReservationsError('')

    try {
      const response = await fetch(
        'http://localhost:8080/api/reservations/me',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (response.status === 401) {
        handleLogout()
        return
      }

      if (!response.ok) {
        setReservationsError('Não foi possível carregar as reservas')
        return
      }

      const data = await response.json()
      setReservations(data)
    } catch (error) {
      console.error(error)
      setReservationsError('Erro ao conectar com o servidor')
    } finally {
      setReservationsLoading(false)
    }
  }

  async function openReservationForm() {
    setReservationFormError('')
    setShowReservationForm(true)

    try {
      const [vehiclesResponse, spotsResponse] = await Promise.all([
        fetch('http://localhost:8080/api/vehicles/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }),
        fetch('http://localhost:8080/api/parking-spots', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
      ])

      if (
        vehiclesResponse.status === 401 ||
        spotsResponse.status === 401
      ) {
        handleLogout()
        return
      }

      if (vehiclesResponse.ok) {
        setVehicles(await vehiclesResponse.json())
      }

      if (spotsResponse.ok) {
        setParkingSpots(await spotsResponse.json())
      }
    } catch (error) {
      console.error(error)
      setReservationFormError(
        'Não foi possível carregar veículos e vagas'
      )
    }
  }

  function closeReservationForm() {
    setShowReservationForm(false)
    setReservationFormError('')
    setReservationVehicleId('')
    setReservationSpotId('')
    setReservationStartTime('')
    setReservationEndTime('')
  }

  async function handleCreateReservation(event) {
    event.preventDefault()

    setReservationSaving(true)
    setReservationFormError('')

    if (
      new Date(reservationEndTime) <=
      new Date(reservationStartTime)
    ) {
      setReservationFormError(
        'O horário final deve ser depois do horário inicial'
      )
      setReservationSaving(false)
      return
    }

    try {
      const params = new URLSearchParams({
        vehicleId: reservationVehicleId,
        parkingSpotId: reservationSpotId,
        startTime: reservationStartTime,
        endTime: reservationEndTime
      })

      const response = await fetch(
        `http://localhost:8080/api/reservations?${params.toString()}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (response.status === 401) {
        handleLogout()
        return
      }

      if (!response.ok) {
        let errorMessage = 'Não foi possível criar a reserva'

        try {
          const errorData = await response.json()

          if (errorData.message) {
            errorMessage = errorData.message
          }
        } catch {
          //
        }

        setReservationFormError(errorMessage)
        return
      }

      closeReservationForm()
      await loadReservations()
    } catch (error) {
      console.error(error)
      setReservationFormError('Erro ao conectar com o servidor')
    } finally {
      setReservationSaving(false)
    }
  }

  async function handleCancelReservation(reservationId) {
    if (!window.confirm('Deseja realmente cancelar esta reserva?')) {
      return
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/reservations/${reservationId}/cancel`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (response.status === 401) {
        handleLogout()
        return
      }

      if (!response.ok) {
        alert('Não foi possível cancelar a reserva')
        return
      }

      await loadReservations()
    } catch (error) {
      console.error(error)
      alert('Erro ao conectar com o servidor')
    }
  }

  function formatDateTime(value) {
    if (!value) return '-'

    return new Date(value).toLocaleString('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'short'
    })
  }

  function renderDashboard() {
    const activeSpots = parkingSpots.filter((spot) => spot.active).length
    const activeReservations = reservations.filter(
      (reservation) => reservation.status === 'ACTIVE'
    ).length

    return (
      <>
        <header className="dashboard-header">
          <div>
            <h2>Dashboard</h2>
            <p>Visão geral do SmartPark</p>
          </div>

          <div className="user-box">
            <span>Olá,</span>
            <strong>{userName}</strong>
          </div>
        </header>

        <section className="welcome-card">
          <h3>Bem-vindo ao SmartPark 👋</h3>
          <p>
            Gerencie seus veículos, estacionamentos, vagas e reservas
            em um só lugar.
          </p>
        </section>

        <section className="stats-grid">
          <div className="stat-card">
            <span>Veículos</span>
            <strong>{vehicles.length}</strong>
            <p>Veículos carregados</p>
          </div>

          <div className="stat-card">
            <span>Estacionamentos</span>
            <strong>{parkingLots.length}</strong>
            <p>Locais carregados</p>
          </div>

          <div className="stat-card">
            <span>Vagas</span>
            <strong>{activeSpots}</strong>
            <p>Vagas ativas carregadas</p>
          </div>

          <div className="stat-card">
            <span>Reservas</span>
            <strong>{activeReservations}</strong>
            <p>Reservas ativas</p>
          </div>
        </section>
      </>
    )
  }

  function renderVehicles() {
    return (
      <>
        <header className="dashboard-header">
          <div>
            <h2>Veículos</h2>
            <p>Seus veículos cadastrados</p>
          </div>

          <div className="user-box">
            <span>Olá,</span>
            <strong>{userName}</strong>
          </div>
        </header>

        <section className="vehicles-section">
          <div className="section-header">
            <div>
              <h3>Meus veículos</h3>
              <p>Veículos vinculados à sua conta</p>
            </div>

            <button className="primary-button" onClick={openVehicleForm}>
              + Novo veículo
            </button>
          </div>

          {vehiclesLoading && (
            <div className="empty-card">Carregando veículos...</div>
          )}

          {vehiclesError && (
            <div className="error-card">{vehiclesError}</div>
          )}

          {!vehiclesLoading &&
            !vehiclesError &&
            vehicles.length === 0 && (
              <div className="empty-card">
                <h4>Nenhum veículo cadastrado</h4>
                <p>Você ainda não possui veículos cadastrados.</p>
              </div>
            )}

          {!vehiclesLoading &&
            !vehiclesError &&
            vehicles.length > 0 && (
              <div className="vehicle-grid">
                {vehicles.map((vehicle) => (
                  <div className="vehicle-card" key={vehicle.id}>
                    <div className="vehicle-card-top">
                      <span className="vehicle-icon">🚗</span>
                      <span className="vehicle-id">#{vehicle.id}</span>
                    </div>

                    <h4>
                      {vehicle.brand} {vehicle.model}
                    </h4>

                    <div className="vehicle-info">
                      <span>Placa</span>
                      <strong>{vehicle.plate}</strong>
                    </div>

                    <div className="vehicle-info">
                      <span>Cor</span>
                      <strong>{vehicle.color || 'Não informada'}</strong>
                    </div>
                  </div>
                ))}
              </div>
            )}
        </section>

        {showVehicleForm && (
          <div className="modal-overlay">
            <div className="modal-card">
              <div className="modal-header">
                <div>
                  <h3>Novo veículo</h3>
                  <p>Cadastre um veículo na sua conta</p>
                </div>

                <button
                  className="modal-close"
                  type="button"
                  onClick={closeVehicleForm}
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleCreateVehicle}>
                <div className="input-group">
                  <label>Placa</label>
                  <input
                    value={plate}
                    onChange={(e) => setPlate(e.target.value)}
                    required
                  />
                </div>

                <div className="input-group">
                  <label>Marca</label>
                  <input
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    required
                  />
                </div>

                <div className="input-group">
                  <label>Modelo</label>
                  <input
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    required
                  />
                </div>

                <div className="input-group">
                  <label>Cor</label>
                  <input
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                  />
                </div>

                {vehicleFormError && (
                  <div className="form-error">{vehicleFormError}</div>
                )}

                <div className="modal-actions">
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={closeVehicleForm}
                  >
                    Cancelar
                  </button>

                  <button
                    className="primary-button"
                    disabled={vehicleSaving}
                  >
                    {vehicleSaving ? 'Salvando...' : 'Cadastrar veículo'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </>
    )
  }

  function renderParkingLots() {
    return (
      <>
        <header className="dashboard-header">
          <div>
            <h2>Estacionamentos</h2>
            <p>Estacionamentos disponíveis no SmartPark</p>
          </div>

          <div className="user-box">
            <span>Olá,</span>
            <strong>{userName}</strong>
          </div>
        </header>

        <section className="parking-section">
          {parkingLotsLoading && (
            <div className="empty-card">
              Carregando estacionamentos...
            </div>
          )}

          {parkingLotsError && (
            <div className="error-card">{parkingLotsError}</div>
          )}

          <div className="parking-grid">
            {parkingLots.map((parkingLot) => (
              <div className="parking-card" key={parkingLot.id}>
                <div className="parking-card-top">
                  <div className="parking-icon">🅿️</div>
                  <span className="parking-id">#{parkingLot.id}</span>
                </div>

                <h4>{parkingLot.name}</h4>

                <div className="parking-info">
                  <span>Endereço</span>
                  <strong>{parkingLot.address}</strong>
                </div>

                <div className="parking-info">
                  <span>Cidade</span>
                  <strong>{parkingLot.city}</strong>
                </div>
              </div>
            ))}
          </div>
        </section>
      </>
    )
  }

  function renderParkingSpots() {
    const activeSpots = parkingSpots.filter((spot) => spot.active).length
    const inactiveSpots = parkingSpots.length - activeSpots

    return (
      <>
        <header className="dashboard-header">
          <div>
            <h2>Vagas</h2>
            <p>Consulte as vagas cadastradas nos estacionamentos</p>
          </div>

          <div className="user-box">
            <span>Olá,</span>
            <strong>{userName}</strong>
          </div>
        </header>

        <section className="spots-section">
          <div className="spots-summary">
            <div className="spot-summary-card">
              <span>Total de vagas</span>
              <strong>{parkingSpots.length}</strong>
            </div>

            <div className="spot-summary-card">
              <span>Ativas</span>
              <strong>{activeSpots}</strong>
            </div>

            <div className="spot-summary-card">
              <span>Inativas</span>
              <strong>{inactiveSpots}</strong>
            </div>
          </div>

          <div className="spots-grid">
            {parkingSpots.map((spot) => (
              <div
                className={
                  spot.active
                    ? 'spot-card active-spot'
                    : 'spot-card inactive-spot'
                }
                key={spot.id}
              >
                <div className="spot-card-header">
                  <div className="spot-code">{spot.code}</div>

                  <span
                    className={
                      spot.active
                        ? 'spot-status status-active'
                        : 'spot-status status-inactive'
                    }
                  >
                    {spot.active ? 'Ativa' : 'Inativa'}
                  </span>
                </div>

                <div className="spot-parking-info">
                  <span>Estacionamento</span>
                  <strong>{spot.parkingLot?.name || 'Não informado'}</strong>
                </div>

                <div className="spot-parking-info">
                  <span>Cidade</span>
                  <strong>{spot.parkingLot?.city || 'Não informada'}</strong>
                </div>

                <div className="spot-number">Vaga #{spot.id}</div>
              </div>
            ))}
          </div>
        </section>
      </>
    )
  }

  function renderReservations() {
    return (
      <>
        <header className="dashboard-header">
          <div>
            <h2>Reservas</h2>
            <p>Gerencie suas reservas de vagas</p>
          </div>

          <div className="user-box">
            <span>Olá,</span>
            <strong>{userName}</strong>
          </div>
        </header>

        <section className="reservations-section">
          <div className="section-header">
            <div>
              <h3>Minhas reservas</h3>
              <p>Consulte e gerencie suas reservas</p>
            </div>

            <button
              className="primary-button"
              onClick={openReservationForm}
            >
              + Nova reserva
            </button>
          </div>

          <div className="reservations-grid">
            {reservations.map((reservation) => (
              <div className="reservation-card" key={reservation.id}>
                <div className="reservation-card-header">
                  <div>
                    <span className="reservation-number">
                      Reserva #{reservation.id}
                    </span>

                    <h4>
                      Vaga {reservation.parkingSpot?.code || '-'}
                    </h4>
                  </div>

                  <span
                    className={
                      reservation.status === 'ACTIVE'
                        ? 'reservation-status reservation-active'
                        : 'reservation-status reservation-cancelled'
                    }
                  >
                    {reservation.status === 'ACTIVE'
                      ? 'Ativa'
                      : 'Cancelada'}
                  </span>
                </div>

                <div className="reservation-details">
                  <div>
                    <span>Veículo</span>
                    <strong>
                      {reservation.vehicle?.brand}{' '}
                      {reservation.vehicle?.model}
                    </strong>
                    <small>{reservation.vehicle?.plate}</small>
                  </div>

                  <div>
                    <span>Estacionamento</span>
                    <strong>
                      {reservation.parkingSpot?.parkingLot?.name ||
                        'Não informado'}
                    </strong>
                  </div>

                  <div>
                    <span>Início</span>
                    <strong>{formatDateTime(reservation.startTime)}</strong>
                  </div>

                  <div>
                    <span>Fim</span>
                    <strong>{formatDateTime(reservation.endTime)}</strong>
                  </div>
                </div>

                {reservation.status === 'ACTIVE' && (
                  <button
                    className="cancel-reservation-button"
                    onClick={() =>
                      handleCancelReservation(reservation.id)
                    }
                  >
                    Cancelar reserva
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        {showReservationForm && (
          <div className="modal-overlay">
            <div className="modal-card">
              <div className="modal-header">
                <div>
                  <h3>Nova reserva</h3>
                  <p>Escolha veículo, vaga e horário</p>
                </div>

                <button
                  className="modal-close"
                  onClick={closeReservationForm}
                  type="button"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleCreateReservation}>
                <div className="input-group">
                  <label>Veículo</label>

                  <select
                    value={reservationVehicleId}
                    onChange={(e) =>
                      setReservationVehicleId(e.target.value)
                    }
                    required
                  >
                    <option value="">Selecione um veículo</option>

                    {vehicles.map((vehicle) => (
                      <option key={vehicle.id} value={vehicle.id}>
                        {vehicle.brand} {vehicle.model} - {vehicle.plate}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="input-group">
                  <label>Vaga</label>

                  <select
                    value={reservationSpotId}
                    onChange={(e) =>
                      setReservationSpotId(e.target.value)
                    }
                    required
                  >
                    <option value="">Selecione uma vaga</option>

                    {parkingSpots
                      .filter((spot) => spot.active)
                      .map((spot) => (
                        <option key={spot.id} value={spot.id}>
                          {spot.code} - {spot.parkingLot?.name}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="input-group">
                  <label>Início</label>

                  <input
                    type="datetime-local"
                    value={reservationStartTime}
                    onChange={(e) =>
                      setReservationStartTime(e.target.value)
                    }
                    required
                  />
                </div>

                <div className="input-group">
                  <label>Fim</label>

                  <input
                    type="datetime-local"
                    value={reservationEndTime}
                    onChange={(e) =>
                      setReservationEndTime(e.target.value)
                    }
                    required
                  />
                </div>

                {reservationFormError && (
                  <div className="form-error">
                    {reservationFormError}
                  </div>
                )}

                <div className="modal-actions">
                  <button
                    className="secondary-button"
                    type="button"
                    onClick={closeReservationForm}
                  >
                    Cancelar
                  </button>

                  <button
                    className="primary-button"
                    disabled={reservationSaving}
                  >
                    {reservationSaving
                      ? 'Reservando...'
                      : 'Criar reserva'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </>
    )
  }

  if (token) {
    return (
      <div className="dashboard-page">
        <aside className="sidebar">
          <div className="sidebar-logo">
            <div className="logo-icon">P</div>

            <div>
              <h1>SmartPark</h1>
              <span>Gestão de estacionamento</span>
            </div>
          </div>

          <nav className="sidebar-menu">
            <button
              className={
                currentPage === 'dashboard'
                  ? 'menu-item active'
                  : 'menu-item'
              }
              onClick={() => setCurrentPage('dashboard')}
            >
              Dashboard
            </button>

            <button
              className={
                currentPage === 'vehicles'
                  ? 'menu-item active'
                  : 'menu-item'
              }
              onClick={loadVehicles}
            >
              Veículos
            </button>

            <button
              className={
                currentPage === 'parkingLots'
                  ? 'menu-item active'
                  : 'menu-item'
              }
              onClick={loadParkingLots}
            >
              Estacionamentos
            </button>

            <button
              className={
                currentPage === 'parkingSpots'
                  ? 'menu-item active'
                  : 'menu-item'
              }
              onClick={loadParkingSpots}
            >
              Vagas
            </button>

            <button
              className={
                currentPage === 'reservations'
                  ? 'menu-item active'
                  : 'menu-item'
              }
              onClick={loadReservations}
            >
              Reservas
            </button>
          </nav>

          <button className="logout-button" onClick={handleLogout}>
            Sair
          </button>
        </aside>

        <main className="dashboard-content">
          {currentPage === 'dashboard' && renderDashboard()}
          {currentPage === 'vehicles' && renderVehicles()}
          {currentPage === 'parkingLots' && renderParkingLots()}
          {currentPage === 'parkingSpots' && renderParkingSpots()}
          {currentPage === 'reservations' && renderReservations()}
        </main>
      </div>
    )
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="logo">
          <div className="logo-icon">P</div>

          <div>
            <h1>SmartPark</h1>
            <span>Estacionamento inteligente</span>
          </div>
        </div>

        <div className="login-header">
          <h2>
            {authMode === 'login'
              ? 'Bem-vindo'
              : 'Criar conta'}
          </h2>

          <p>
            {authMode === 'login'
              ? 'Entre na sua conta para continuar'
              : 'Cadastre-se para usar o SmartPark'}
          </p>
        </div>

        <form
          onSubmit={
            authMode === 'login'
              ? handleLogin
              : handleRegister
          }
        >
          {authMode === 'register' && (
            <div className="input-group">
              <label>Nome</label>

              <input
                type="text"
                placeholder="Seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="input-group">
            <label>E-mail</label>

            <input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Senha</label>

            <input
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />
          </div>

          <button
            className="login-button"
            disabled={loading}
          >
            {loading
              ? 'Aguarde...'
              : authMode === 'login'
                ? 'Entrar'
                : 'Criar conta'}
          </button>
        </form>

        {message && (
          <p className="login-message">{message}</p>
        )}

        <div className="register">
          <span>
            {authMode === 'login'
              ? 'Não possui uma conta?'
              : 'Já possui uma conta?'}
          </span>

          <button
            type="button"
            onClick={() => {
              setAuthMode(
                authMode === 'login'
                  ? 'register'
                  : 'login'
              )

              setMessage('')
              setName('')
              setEmail('')
              setPassword('')
            }}
          >
            {authMode === 'login'
              ? 'Criar conta'
              : 'Fazer login'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default App