import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  try {
    // Extract the username and password from the request body
    const { username, password } = await request.json();

    // Define the Axios request options
    const options = {
      method: 'POST',
      url: 'https://restapi.tu.ac.th/api/v1/auth/Ad/verify',
      headers: {
        'Content-Type': 'application/json',
        'Application-Key': 'TU6b1f393bbfde259970780165d1a961f2c0300e2159fde033347920ff3f1fc2aa217fb5388bf72b08af58099db51fc4cc',
      },
      data: {
        UserName: username,
        PassWord: password,
      },
    };

    // Make the request to the external API
    const response = await axios(options);

    // Return the response from the external API
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error making request:', error);
    return NextResponse.json({ error: 'Error verifying user' }, { status: 500 });
  }
}