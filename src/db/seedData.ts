import {
  addBusOperator,
  addBusSchedule,
  addSearchHistory,
  getBusOperators,
} from './database';

export const seedMockData = async (): Promise<void> => {
  try {
    await addSearchHistory('Delhi', 'Agra');
    await new Promise((resolve) => setTimeout(resolve, 100));

    await addSearchHistory('Delhi', 'Jaipur');
    await new Promise((resolve) => setTimeout(resolve, 100));

    await addSearchHistory('Mumbai', 'Pune');
    await new Promise((resolve) => setTimeout(resolve, 100));

    await addSearchHistory('Bangalore', 'Chennai');
    await new Promise((resolve) => setTimeout(resolve, 100));

    await addSearchHistory('Hyderabad', 'Vijayawada');

    const operators: Array<{
      operator_name: string;
      operator_code: string;
      is_state_transport: 0 | 1;
    }> = [
      { operator_name: 'UPSRTC', operator_code: 'UPSRTC', is_state_transport: 1 },
      {
        operator_name: 'Volvo Travels',
        operator_code: 'VOLVO',
        is_state_transport: 0,
      },
      { operator_name: 'MSRTC', operator_code: 'MSRTC', is_state_transport: 1 },
    ];

    for (const op of operators) {
      await addBusOperator(
        op.operator_name,
        op.operator_code,
        op.is_state_transport === 1
      );
    }

    const savedOperators = await getBusOperators();
    const operatorIdByCode = new Map(
      savedOperators.map((op) => [op.operatorCode, op.id])
    );

    const schedules: Array<{
      bus_number: string;
      operator_code: string;
      from_city: string;
      to_city: string;
      departure_time: string;
      arrival_time: string;
      fare: number;
      is_ac: 0 | 1;
      is_sleeper: 0 | 1;
    }> = [
      {
        bus_number: 'UPSRTC-101',
        operator_code: 'UPSRTC',
        from_city: 'Delhi',
        to_city: 'Agra',
        departure_time: '08:00',
        arrival_time: '11:30',
        fare: 350,
        is_ac: 0,
        is_sleeper: 0,
      },
      {
        bus_number: 'VOLVO-204',
        operator_code: 'VOLVO',
        from_city: 'Delhi',
        to_city: 'Jaipur',
        departure_time: '09:00',
        arrival_time: '14:00',
        fare: 899,
        is_ac: 1,
        is_sleeper: 1,
      },
      {
        bus_number: 'MSRTC-330',
        operator_code: 'MSRTC',
        from_city: 'Mumbai',
        to_city: 'Pune',
        departure_time: '07:30',
        arrival_time: '11:00',
        fare: 450,
        is_ac: 1,
        is_sleeper: 0,
      },
    ];

    for (const schedule of schedules) {
      const operatorId = operatorIdByCode.get(schedule.operator_code);
      if (!operatorId) {
        continue;
      }

      await addBusSchedule(
        schedule.bus_number,
        operatorId,
        schedule.from_city,
        schedule.to_city,
        schedule.departure_time,
        schedule.arrival_time,
        schedule.fare,
        schedule.is_ac === 1,
        schedule.is_sleeper === 1
      );
    }

    console.log('Mock data seeded successfully');
  } catch (error) {
    console.error('Error seeding mock data:', error);
  }
};
