import React, { useState } from 'react';
import axiosInstance from '@lib/axios';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@context/AuthContext';
import validate from 'validate.js'



const useLogin = () => {
    const navigate = useNavigate();
    const { setAuthUser } = useAuthContext();

}

