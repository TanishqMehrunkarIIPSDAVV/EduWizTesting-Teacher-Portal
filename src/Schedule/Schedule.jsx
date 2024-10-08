import { useState, useEffect } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import axios from 'axios';
import { TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import { format } from 'date-fns';
import SuccessModal from '../AlertModel/AlertModel';

const StyledTimePicker = styled(TimePicker)(() => ({
  '& .MuiInputBase-root': {
    // backgroundColor: '#fff',
    color: '#000',
    borderRadius: '10px',
    height: '40px',
    '& fieldset': {
      border: 'none',
    },
  },
  '& .MuiInputBase-input': {
    padding: '8px 14px',
    fontSize: '1rem',
    color: '#000',
  },
  '& .MuiIconButton-root': {
    color: '#000',
  },
  'html[class~="dark"] &': {
    '& .MuiInputBase-root': {
      backgroundColor: '#374151',
      color: '#fff',
    },
    '& .MuiInputBase-input': {
      color: '#fff',
    },
    '& .MuiIconButton-root': {
      color: '#fff',
    },
  },
}));
const StyledDatePicker = styled(DatePicker)(() => ({
  '& .MuiInputBase-root': {
    // backgroundColor: '#fff',
    color: '#000',
    borderRadius: '10px',
    height: '40px',
    '& fieldset': {
      border: 'none',
    },
  },
  '& .MuiInputBase-input': {
    padding: '8px 14px',
    fontSize: '1rem',
    color: '#000',
  },
  '& .MuiIconButton-root': {
    color: '#000',
  },
  'html[class~="dark"] &': {
    '& .MuiInputBase-root': {
      backgroundColor: '#374151',
      color: '#fff',
    },
    '& .MuiInputBase-input': {
      color: '#fff',
    },
    '& .MuiInputBase-input:placeholder': {
      color: '#fff',
    },
    '& .MuiIconButton-root': {
      color: '#fff',
    },
  },
}));

const SchedulePaper = () => {
  const [paperName, setpaperName] = useState('');
  const [className, setClassName] = useState('');
  const [subject, setSubject] = useState('');
  const [marks, setMarks] = useState('');
  const [duration, setDuration] = useState({ hours: '', minutes: '' });
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [marksError, setMarksError] = useState('');
  // const [durationError, setDurationError] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const subjects = ['Math', 'Science', 'History', 'English', 'Computer Science'];

  const validateMarks = (value) => {
    // Regular expression to allow only digits (0-9)
    const regex = /^[0-9]*$/;

    if (!regex.test(value)) {
      setMarksError('Marks can only contain numbers');
    } else if (value < 0) {
      setMarksError('Marks cannot be negative');
    } else {
      setMarksError('');
    }

    // Update the state only if the value is valid
    setMarks(value);
  };

  const handleDurationChange = (field, value) => {
    if (value >= 0) {
      setDuration({ ...duration, [field]: value });
    }
  };

  const formatDateForDB = (dateValue) => {
    if (!dateValue) return '';
    return format(dateValue, 'MM/dd/yyyy');
  };

  const formatTimeForDB = (timeDate) => {
    if (!timeDate) return '';
    return format(timeDate, 'hh:mm aa');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const minutes = duration.minutes.trim() === '' ? '00' : duration.minutes;
    const teacherId = localStorage.getItem('teacherId');
    // console.log(teacherId);
    if (!marksError) {
      const paperData = {
        paperName,
        className,
        subject,
        marks,
        duration: {
          hours: duration.hours,
          minutes: minutes,
        },
        date: formatDateForDB(date),
        time: formatTimeForDB(time),
        teacherId,
      };
      try {
        await axios.post('http://localhost:5000/paper/schedule', paperData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        setModalMessage('Paper Scheduled Successfully');
        setIsModalOpen(true);
        // Clear form fields after successful submission
        setpaperName('');
        setClassName('');
        setSubject('');
        setMarks('');
        setDuration({ hours: '', minutes: '' });
        setDate(null);
        setTime(null);
      } catch (error) {
        console.error('Error scheduling paper:', error);
        setModalMessage('Error Scheduling paper');
        setIsError(true);
        setIsModalOpen(true);
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    document.title = 'Schedule Paper | EduWiz';
  }, []);
  return (
    <div
      className={`max-w-xl mx-auto mt-10 p-6 bg-container-light dark:bg-container-dark shadow-[0px_0px_10px_#00000059;] dark:shadow-[0px_0px_10px_#ffffff7a;] rounded-lg transition-all duration-500}`}
    >
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-black text-left dark:text-white ">Schedule a Paper</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="md:grid grid-cols-2 pb-8 gap-x-8 gap-y-6">
          {/* Class Name Input */}
          <div className="flex md:flex-row gap-2 col-span-2 flex-col">
            <label className="block dark:text-white text-wrap text-lg w-50 font-semibold">Course Name</label>
            <select
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-primary bg-input-light dark:border-white dark:bg-input-dark dark:text-white rounded-md  text-graydark focus:outline-none appearance-none leading-tight focus:shadow-outline"
            >
              <option value="" disabled>
                --Select a course--
              </option>
              <option value="M.Tech">M.Tech.</option>
              <option value="MCA">MCA</option>
            </select>
          </div>

          {/* Paper name */}
          <div className="space-y-2 ">
            <label className="block dark:text-white text-wrap w-full font-semibold">Paper Type</label>
            <select
              value={paperName}
              onChange={(e) => setpaperName(e.target.value)}
              required
              className="w-full px-3 py-2 bg-input-light dark:bg-input-dark dark:border-white dark:text-white border border-primary rounded-md  text-graydark focus:outline-none appearance-none leading-tight focus:shadow-outline focus:shadow-outline"
            >
              <option value="" disabled>
                --Select paper type--
              </option>
              <option value="Test 1">Test 1</option>
              <option value="Test 2">Test 2</option>
              <option value="Test 3">Test 3</option>
              <option value="End Sem">End Sem</option>
            </select>
          </div>

          {/* Subject Dropdown */}
          <div className="space-y-1 text-[#cccacd] dark:text-[#cccacd]">
            <label className="block w-full text-[#000] dark:text-white font-semibold mb-1">Subject</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              className="w-full px-3 py-2 bg-input-light border border-primary dark:border-white dark:bg-input-dark dark:text-white  rounded-md  text-graydark focus:outline-none appearance-none leading-tight focus:shadow-outline"
            >
              <option value="" disabled>
                --Select a subject--
              </option>
              {subjects.map((subj, index) => (
                <option key={index} value={subj}>
                  {subj}
                </option>
              ))}
            </select>
          </div>

          {/* Marks Input */}
          <div className="space-y-1">
            <label className="block w-full  text-gray-700 font-semibold mb-1">Marks</label>
            <input
              type="tel"
              value={marks}
              onChange={(e) => validateMarks(e.target.value)}
              className="w-full px-3 py-2 bg-input-light border border-primary dark:border-white dark:bg-input-dark dark:text-white   rounded-md dark:placeholder:text-white  focus:outline-none appearance-none leading-tight focus:shadow-outline"
              placeholder="Enter marks"
              required
            />
            {marksError && <p className="text-red-500 text-xs mt-1 ml-2">{marksError}</p>}
          </div>

          {/* Duration Input */}
          <div className="space-y-1">
            <label className="block w-full font-semibold mb-1">Duration (in minutes)</label>
            <div className="flex justify-start items-center gap-2 ">
              <input
                type="number"
                placeholder="Hours"
                className="w-full px-3 py-2 bg-input-light border border-primary dark:border-white dark:bg-input-dark dark:text-white  rounded-md dark:placeholder:text-white  focus:outline-none appearance-none leading-tight focus:shadow-outline"
                value={duration.hours}
                onChange={(e) => handleDurationChange('hours', e.target.value)}
              />
              :
              <input
                type="number"
                placeholder="Minutes"
                className="w-full px-3 py-2 bg-input-light border border-primary dark:border-white dark:bg-input-dark dark:text-white rounded-md dark:placeholder:text-white  focus:outline-none appearance-none leading-tight focus:shadow-outline"
                value={duration.minutes}
                onChange={(e) => handleDurationChange('minutes', e.target.value)}
              />
            </div>
          </div>

          {/* Date Picker */}
          <div className="space-y-1 ">
            <label className="block w-full font-semibold mb-1">Date</label>
            <div className="w-full rounded-md bg-input-light border border-primary dark:border-white dark:bg-input-dark dark:text-white ">
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <StyledDatePicker
                  value={date}
                  onChange={(newDate) => setDate(newDate)}
                  renderInput={(params) => <TextField {...params} required />}
                />
              </LocalizationProvider>
            </div>
          </div>

          {/* Time Picker */}
          <div className="space-y-1">
            <label className="block w-full text-gray-700 dark:text-gray-300 font-semibold mb-1">
              Time: (12 hrs format)
            </label>
            <div className="w-full rounded-md bg-input-light border border-primary dark:border-white dark:bg-input-dark dark:text-white ">
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <StyledTimePicker
                  value={time}
                  onChange={(newTime) => setTime(newTime)}
                  ampm={true}
                  views={['hours', 'minutes']}
                  inputFormat="HH:MM A"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      fullWidth
                      required
                      placeholder="HH:MM AA"
                      InputProps={{
                        ...params.InputProps,
                      }}
                    />
                  )}
                />
              </LocalizationProvider>
            </div>
          </div>
        </div>
        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-primary-light dark:bg-primary-dark hover:bg-hover-light dark:hover:bg-hover-dark transition text-white font-bold py-2 px-4 rounded-md"
          disabled={marksError}
        >
          Schedule Paper
        </button>
      </form>
      <SuccessModal isOpen={isModalOpen} onClose={closeModal} message={modalMessage} isError={isError} />
    </div>
  );
};

export default SchedulePaper;
