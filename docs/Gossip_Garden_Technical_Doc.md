# Documentación Técnica: Proyecto Gossip Garden

## 1. Visión General
**Gossip Garden** es una plataforma de monitoreo y cuidado de plantas impulsada por el Internet de las Cosas (IoT) e Inteligencia Artificial. El proyecto busca humanizar la interacción entre los usuarios y su entorno vegetal, permitiendo que las plantas "hablen" (interacción proactiva) basándose en datos ambientales capturados en tiempo real.

---

## 2. Arquitectura del Sistema
El proyecto emplea una arquitectura distribuida y políglota para optimizar el rendimiento y la escalabilidad.

### 2.1. Componentes Principales
- **Hardware (Capa de Percepción):** Basado en el microcontrolador ESP32 con sensores ambientales.
- **Backend (Capa de Lógica):** Desarrollado en **FastAPI** y desplegado mediante contenedores **Docker**.
- **Comunicación:** Protocolo **MQTT** centralizado a través de **HiveMQ Cloud**.
- **Capa de Persistencia:** Sistema de almacenamiento híbrido (SQL y NoSQL).

---

## 3. Stack Tecnológico

| Componente | Tecnología | Propósito |
| :--- | :--- | :--- |
| **Backend** | FastAPI (Python) | API REST y lógica de negocio. |
| **Hardware** | ESP32 (MicroPython) | Control de sensores y conectividad. |
| **Base de Datos Relacional** | PostgreSQL / Supabase | Gestión de usuarios, plantas y entidades sociales. |
| **Métricas de Sensores** | MongoDB / Firebase | Almacenamiento de series temporales (datos crudos). |
| **Cache / Mensajería** | Redis | Logs de chats en tiempo real. |
| **Infraestructura** | Docker | Contenerización del backend. |
| **Broker MQTT** | HiveMQ Cloud | Comunicación asíncrona entre hardware y servidor. |
| **IA** | Modelos LLM | Procesamiento de lenguaje natural y proactividad. |

---

## 4. Modelado y Gestión de Datos

### 4.1. Persistencia Políglota
El sistema divide los datos según su naturaleza:
1. **Datos Estructurales (Relacional):** Entidades con relaciones complejas (Usuarios, Amistades).
2. **Datos Crudos (No Relacional):** Telemetría de sensores enviada frecuentemente.
3. **Logs de Sesión (Volátil):** Historial de chats rápidos.

### 4.2. Ciclo de Vida de Métricas
- **Retención:** Los datos de sensores se almacenan en crudo por un periodo de **30 días**.
- **Agregación:** El día 1 de cada mes, los datos se consolidan en una métrica mensual estructurada para análisis a largo plazo.

### 4.3. Esquema de Entidades (MER)
- **USERS:**
  - `id` (UUID, PK)
  - `username` (String, Unique)
  - `email` (String, Unique)
  - `password_hash` (String)
  - `created_at` (Timestamp)
- **FRIENDSHIPS:**
  - `id` (UUID, PK)
  - `user_id_1` (FK): Solicitante.
  - Gestión de solicitudes y vínculos sociales.

---

## 5. Hardware e Interacción IoT

### 5.1. Configuración de Sensores
| Sensor | Variable Medida |
| :--- | :--- |
| **DHT22** | Temperatura y Humedad Ambiente. |
| **GY-30** | Intensidad Lumínica (Lux). |
| **SEN0193** | Humedad del Suelo (Capacitivo). |

### 5.2. Lógica de Comunicación
El microcontrolador ESP32 publica los estados de los sensores vía MQTT. La IA procesa estos valores y decide si debe iniciar una conversación con el usuario ("Proactividad").

---

## 6. Funcionalidades Clave
- **Registro de Usuarios:** Soporte para autenticación tradicional y proveedores externos (**Google OAuth**).
- **Proactividad de la IA:** El sistema no espera la consulta del usuario; si detecta estrés hídrico o falta de luz, la planta inicia el diálogo.
- **Componente Social:** Sistema de amistades para compartir el estado de las plantas e interactuar con otros jardineros.

---

## 7. Estado del Proyecto e Hitos
- **Backend:** Contenedor Docker funcional con el arranque de la aplicación exitoso.
- **Modelado de Datos:** Iterando sobre el MER, específicamente refinando la entidad `FRIENDSHIPS`.
- **Desafíos Pendientes:**
  - Implementación de un **WiFi Manager** (Aprovisionamiento inalámbrico) para evitar credenciales quemadas en el código.
  - Integración del frontend para la configuración inicial de red.

---

## 8. Guía de Desarrollo
- **Regla de Oro en Hardware:** No reescribir el bucle principal (`main loop`) del ESP32 para asegurar la estabilidad de las lecturas.
- **Referencia Técnica:** Seguir estrictamente las instrucciones contenidas en `sensors.instructions-4.md` para lógicas de reconexión MQTT.
- **Entorno:** Desarrollo en **PyCharm** y despliegue local/testeo mediante Docker.
