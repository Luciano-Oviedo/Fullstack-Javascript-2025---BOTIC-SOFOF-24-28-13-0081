--En este ejemplo usaremos funciones de agregación y los comandos SELECT, WHERE, JOIN, GROUP BY y ORDER BY para consultar información
--sobre el precio promedio de las cartas que tienen un coste igual o inferior a "2", agrupado por tipo de cartas y ordenado por valor ascendente del precio promedio

select 
    tc.nombre as tipo,              -- Seleccionamos el nombre del tipo de carta
    avg(pc.precio) as precio_promedio -- Calculamos el promedio de precios
from cartas c
join precios_cartas pc on c.id_carta = pc.id_carta -- Relacionamos cartas con sus precios
join tipo_carta tc on c.id_tipo = tc.id_tipo       -- Relacionamos cartas con su tipo
where c.coste <= 2                                -- Filtramos cartas con coste ≤ 2
group by tc.nombre                                -- Agrupamos por tipo de carta
order by precio_promedio asc;                     -- Ordenamos por el precio promedio (ascendente)