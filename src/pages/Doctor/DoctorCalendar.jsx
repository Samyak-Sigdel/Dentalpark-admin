import React, { useState, useEffect, useContext } from 'react';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Paper, Typography, Box, Divider, Badge } from '@mui/material';
import axios from 'axios';
import { DoctorContext } from '../../context/DoctorContext';

const DoctorCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const { backendUrl } = useContext(DoctorContext);

  const toLocalDateString = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const fetchAppointments = async (date) => {
    const formatted = toLocalDateString(date);
    try {
      const res = await axios.get(`${backendUrl}/api/doctor/appointments-by-date?date=${formatted}`, {
        headers: {
          dToken: localStorage.getItem("dToken"),
        },
      });
      if (res.data.success) {
        setAppointments(res.data.appointments);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchAppointments(selectedDate);
  }, [selectedDate]);

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} `;
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ 
        maxWidth: '1000px',  
        mx: 'auto', 
        p: 3,  
        fontSize: '1.05rem'  
      }}>
        <Typography variant="h4" component="h1" sx={{ 
          fontWeight: 'bold', 
          mb: 4,  
          textAlign: 'center',
          color: '#0d9488 ',
          fontSize: '1.8rem'  
        }}>
          Appointment Calendar
        </Typography>

        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' }, 
          gap: 5  
        }}>
       
          <Paper elevation={0} sx={{ 
            p: 3,  
            borderRadius: 3,  
            flex: 1,
            border: '1px solid',
            borderColor: 'divider',
            minHeight: '400px' 
          }}>
            <DateCalendar
              value={selectedDate}
              onChange={(newDate) => {
                setSelectedDate(newDate);
                fetchAppointments(newDate);
              }}
              sx={{
                width: '100%',
                '& .Mui-selected': {
                  backgroundColor: '#0d9488 !important',
                  color: 'white',
                  borderRadius: '50%',
                  fontSize: '1.1rem' 
                },
                '& .MuiPickersCalendarHeader-label': {
                  fontSize: '1.2rem',  
                  fontWeight: 'bold'
                },
                '& .MuiTypography-caption': {
                  fontSize: '1rem',  
                  width: '36px',
                  height: '36px'
                },
                '& .MuiPickersDay-root': {
                  fontSize: '1rem', 
                  width: '36px',
                  height: '36px',
                  margin: '2px 4px'
                },
              }}
            />
          </Paper>

        
          <Box sx={{ 
            flex: 1, 
            maxWidth: { md: '400px' },  
            fontSize: '1.1rem'  
          }}>
            <Typography variant="h5" component="h2" sx={{  
              fontWeight: 'medium',
              mb: 2,
              fontSize: '1.4rem' 
            }}>
              {selectedDate.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </Typography>
            
            <Divider sx={{ my: 3 }} />  

            {appointments.length > 0 ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>  
                {appointments.map((appt) => (
                  <Paper 
                    key={appt._id}
                    elevation={0}
                    sx={{ 
                      p: 2.5,  
                      borderRadius: 1.5,  
                      border: '1px solid',
                      borderColor: 'divider',
                      position: 'relative'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}> 
                      <Badge
                        color={appt.cancelled ? 'error' : appt.isCompleted ? 'success' : 'primary'}
                        variant="dot"
                        sx={{ 
                          mr: 2,  
                          '& .MuiBadge-badge': {
                            width: 12, 
                            height: 12,
                          }
                        }}
                      />
                      <Typography variant="subtitle1" sx={{ 
                        fontWeight: 'medium',
                        fontSize: '1.15rem'  
                      }}>
                        {appt.userData?.name || 'Unknown Patient'}
                      </Typography>
                    </Box>

                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mt: 1.5 
                    }}>
                      <Typography variant="body1" sx={{  
                        color: 'primary ',
                        fontSize: '1rem' 
                      }}>
                        {formatTime(appt.slotTime)}
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        color: appt.cancelled ? 'error.main' : 
                              appt.isCompleted ? 'success.main' : 'primary.main',
                        fontWeight: 'medium',
                        fontSize: '0.95rem'
                      }}>
                        {appt.cancelled ? 'Cancelled' : appt.isCompleted ? 'Completed' : 'Upcoming'}
                      </Typography>
                    </Box>

                    {appt.note && (
                      <Box sx={{ 
                        mt: 2,  
                        p: 1.5,  
                        bgcolor: 'action.hover', 
                        borderRadius: 1,
                        borderLeft: '4px solid', 
                        borderColor: 'primary.main'
                      }}>
                        <Typography variant="body1" sx={{  
                          fontStyle: 'italic',
                          fontSize: '1rem'
                        }}>
                          {appt.note}
                        </Typography>
                      </Box>
                    )}
                  </Paper>
                ))}
              </Box>
            ) : (
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                height: '180px', 
                color: 'text.disabled',
                fontSize: '1.1rem'  
              }}>
                <Typography variant="body1">No appointments scheduled</Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default DoctorCalendar;