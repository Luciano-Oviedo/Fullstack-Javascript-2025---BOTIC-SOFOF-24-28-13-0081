const pool = require("./pool");

// FUNCION TRANSACCION COMPUESTA: creación de un cliente, registrar un pedido a su nombre y actualizar inventario

async function transaccion(
  nombreCliente,
  email,
  direccion,
  id_producto,
  cantidad
) {
  // Validación tipo e ingreso de datos y que cantidad sea un número positivo
  if (
    typeof nombreCliente !== "string" ||
    typeof email !== "string" ||
    typeof direccion !== "string" ||
    typeof id_producto !== "number" ||
    typeof cantidad !== "number" ||
    !nombreCliente.trim() ||
    !email.trim() ||
    !direccion.trim() ||
    isNaN(id_producto) ||
    isNaN(cantidad) ||
    cantidad <= 0
  ) {
    console.log(
      "Debes ingresar parámetros válidos y una cantidad mayor a cero"
    );
  } else {
    // Nos conectamos al pool
    const client = await pool.connect();
    try {
      // Inicio de la transacción
      await client.query("BEGIN");

      // Validamos que el id del producto exista y que la cantidad pedida no exceda el stock
      const idProducto = await client.query(
        "SELECT * FROM inventario WHERE id_producto = $1",
        [id_producto]
      );
      if (idProducto.rowCount === 0) {
        throw new Error("El id del producto ingresado no existe");
      }
      if (idProducto.rows[0].stock < cantidad) {
        throw new Error("La cantidad pedida excede el stock del producto");
      }

      // Creación cliente

      // Validamos que el cliente no exista a través de la restricción de unicidad de email
      let clienteId;
      const clienteExistente = await client.query(
        "SELECT * FROM clientes WHERE email = $1",
        [email]
      );

      // Si el cliente existe lo utilizamos para hacer el pedido, de lo contrario, creamos al cliente
      if (clienteExistente.rowCount > 0) {
        clienteId = clienteExistente.rows[0].id_cliente;
        console.log("Cliente existente encontrado:");
        console.table(clienteExistente.rows[0]);
      } else {
        const nuevoCliente = await client.query(
          "INSERT INTO clientes (nombre_cliente, email, direccion) VALUES ($1, $2, $3) RETURNING *",
          [nombreCliente, email, direccion]
        );
        clienteId = nuevoCliente.rows[0].id_cliente;
        console.log("Nuevo cliente creado:");
        console.table(nuevoCliente.rows[0]);
      }

      // Creacion pedido
      const pedido = await client.query(
        "INSERT INTO pedidos (id_cliente, fecha) VALUES ($1, CURRENT_DATE) RETURNING id_pedido",
        [clienteId]
      );

      // Creación detalles pedido
      const detallePedido = await client.query(
        "INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad) VALUES ($1, $2, $3) RETURNING *",
        [pedido.rows[0].id_pedido, id_producto, cantidad]
      );
      console.log("Pedido creado:");
      console.table(detallePedido.rows[0]);

      // Descuento desde inventario
      const inventario = await client.query(
        "UPDATE inventario SET stock = stock - $1 WHERE id_producto = $2 RETURNING *",
        [cantidad, id_producto]
      );
      console.log(
        "Se actualizaron las cantidades del producto pedido en inventario:"
      );
      console.table(inventario.rows[0]);

      // Confirmación de la transacción
      await client.query("COMMIT");
    } catch (error) {
      // Revertimos la transacción en caso de error
      await client.query("ROLLBACK");
      throw error;
    } finally {
      // Liberamos la conexión al pool
      client.release();
    }
  }
}

// PRUEBAS

async function pruebas() {
  // 1. Transacción exitosa
  try {
    await transaccion(
      "Pedro Moya",
      "pedromoya@mail.cl",
      "Calle San Ignacio 130",
      7,
      10
    );
    // Esperado en consola: la transacción se completa sin errores, muestra logs de cliente, pedido y detalle
  } catch (e) {
    console.error("Error 1:", e.message);
  }

  // 2. Manejo de errores: id del producto no existe
  try {
    await transaccion(
      "Emilia Fuenzalida",
      "emilita@mail.com",
      "Avenida Andes 300",
      215,
      6
    );
  } catch (e) {
    console.error("Error 2:", e.message); // Esperado en consola: "El id del producto ingresado no existe"
  }

  // 3. Manejo de errores: cantidad excede al stock disponible
  try {
    await transaccion(
      "Lázaro Martinez",
      "lazamar@mail.net",
      "Pasaje Alana 54",
      2,
      542
    );
  } catch (e) {
    console.error("Error 3:", e.message); // Esperado en consola: "La cantidad pedida excede el stock del producto"
  }
}

pruebas();
