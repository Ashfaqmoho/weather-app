<?php

    $url = 'https://api.openweathermap.org/data/2.5/weather?q=' . $_GET['city'] . '&appid=218b1c3e21a59ad965a97bfcb3fe7236&units=metric';

    // Get data from openweathermap and store in JSON object
    $data = file_get_contents($url);
    $json = json_decode($data, true);

    // Fetch required fields
    $weather_description = $json['weather'][0]['description']; //current cloud status
    $weather_temperature = $json['main']['temp']; //current temperature
    $weather_temperature_feels = $json['main']['feels_like']; //feeling temperature
    $weather_wind = $json['wind']['speed']; //wind speed
    $weather_humidity = $json['main']['humidity']; //humidity
    $weather_pressure = $json['main']['pressure']; //pressure
    $weather_visibility = $json['visibility']; //visibility
    $weather_when = date("Y-m-d H:i:s"); // now
    $city = $json['name']; // name of city 
    $weather_icon = $json['weather'][0]['icon'] ;//weather icon

    //Lattitude and Longtitude
    $weather_lat = $json['coord']['lat'] ;
    $weather_lon = $json['coord']['lon'] ;

    // Build INSERT SQL statement
    $sql_insert = "INSERT INTO `my-weather` (weather_description, weather_temperature, weather_temperature_feels, weather_wind, weather_humidity, weather_pressure, weather_visibility, weather_when, city, weather_icon, weather_lat, weather_lon)
    VALUES('{$weather_description}', {$weather_temperature}, {$weather_temperature_feels}, {$weather_wind}, {$weather_humidity}, {$weather_pressure}, {$weather_visibility}, '{$weather_when}', '{$city}', '{$weather_icon}', ${weather_lat}, ${weather_lon})";

    // Run SQL statement and report errors
    if (!$mysqli -> query($sql_insert)) {
        echo("<h4>SQL error description: " . $mysqli -> error . "</h4>");
    }
?>
