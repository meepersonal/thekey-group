<?php

namespace Database\Factories;

use App\Models\Agence;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Agence>
 */
class AgenceFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => $this->faker->company(),
            'location' => $this->faker->address(),
            'map_url' => 'https://maps.google.com/?q='.$this->faker->city(),
            'phone' => $this->faker->phoneNumber(),
            'hours' => 'Lun–Sam : 8h00–19h00',
            'is_active' => $this->faker->boolean(90),
            'sort_order' => $this->faker->numberBetween(0, 20),
        ];
    }
}
