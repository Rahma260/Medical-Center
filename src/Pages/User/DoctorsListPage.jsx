import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  Button,
  Avatar,
  Divider,
  TextField,
  FormControlLabel,
  Checkbox,
  Slider,
  IconButton,
  Grid,
  Paper,
  Rating,
  MenuItem,
  Select,
  FormControl,
  CircularProgress,
  Alert,
  Chip,
  Drawer,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import SearchIcon from "@mui/icons-material/Search";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import TuneIcon from "@mui/icons-material/Tune";
import CloseIcon from "@mui/icons-material/Close";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../../Firebase/firebase";

const TEAL_ACCENT = "#0c2993";
const BACKGROUND_COLOR = "#F4F8FB";
const BORDER_COLOR = "#E0E0E0";
const TEXT_SECONDARY = "#6C757D";

const formatPrice = (price) => {
  if (!price) return "N/A";
  return `$${parseFloat(price).toFixed(2)}`;
};

const DoctorCard = ({ doctor, isFeatured, onHover }) => (
  <motion.div whileHover={{ scale: 1.04 }} transition={{ duration: 0.3 }}>
    <Card
      onMouseEnter={() => onHover(doctor.id)}
      onMouseLeave={() => onHover(null)}
      sx={{
        borderRadius: "20px",
        textAlign: "center",
        p: 3,
        bgcolor: isFeatured ? `${TEAL_ACCENT}10` : "white",
        boxShadow: isFeatured
          ? "0 6px 24px rgba(12,41,147,0.25)"
          : "0 4px 14px rgba(0,0,0,0.05)",
        border: `1px solid ${isFeatured ? TEAL_ACCENT : BORDER_COLOR}`,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Box>
        <Avatar
          src={doctor.photo || "https://i.pravatar.cc/150"}
          sx={{
            width: 100,
            height: 100,
            mx: "auto",
            mb: 2,
            border: `3px solid ${TEAL_ACCENT}`,
          }}
        />
        <Typography variant="h6" sx={{ fontWeight: "bold", color: TEAL_ACCENT }}>
          Dr. {doctor.firstName} {doctor.lastName}
        </Typography>
        <Typography variant="body2" color={TEXT_SECONDARY}>
          {doctor.department}
        </Typography>
        <Typography variant="caption" color={TEXT_SECONDARY} sx={{ display: 'block', mt: 1 }}>
          {doctor.institution}
        </Typography>
        <Typography variant="caption" color={TEXT_SECONDARY} sx={{ display: 'block' }}>
          {doctor.yearsOfExperience} years experience
        </Typography>

        <Box sx={{ mt: 2, mb: 1 }}>
          <Chip
            icon={<AttachMoneyIcon sx={{ fontSize: 16 }} />}
            label={formatPrice(doctor.consultationPrice)}
            size="small"
            sx={{
              backgroundColor: "#f8e0ecff",
              color: "#f20b7eff",
              fontWeight: 700,
              fontSize: "0.85rem",
            }}
          />
        </Box>

        <Typography
          variant="caption"
          sx={{
            display: 'block',
            mt: 1,
            color: doctor.scheduleCount > 0 ? '#5f83c3ff' : 'orange',
            fontWeight: 'bold'
          }}
        >
          {doctor.scheduleCount} available slots
        </Typography>
      </Box>

      <Button
        variant="contained"
        size="small"
        sx={{
          mt: 3,
          backgroundColor: TEAL_ACCENT,
          color: "white",
          borderRadius: "10px",
          textTransform: "none",
          "&:hover": { backgroundColor: "#002B7A" },
        }}
        onClick={() => window.location.href = `/doctor/${doctor.id}`}
      >
        View Profile & Book
      </Button>
    </Card>
  </motion.div>
);

// ✅ Filter Panel Component
const FilterPanel = ({
  departments,
  loadingDepartments,
  selectedSpecialties,
  handleSpecialtyChange,
  searchTerm,
  setSearchTerm,
  priceRange,
  setPriceRange,
  gender,
  setGender,
  availability,
  setAvailability,
  experience,
  setExperience,
  clearFilters,
  onClose,
}) => (
  <Box>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
      <Typography variant="h6" fontWeight="bold" color={TEAL_ACCENT}>
        Find Your Doctor
      </Typography>
      {onClose && (
        <IconButton onClick={onClose} sx={{ display: { md: 'none' } }}>
          <CloseIcon />
        </IconButton>
      )}
    </Box>

    <TextField
      fullWidth
      placeholder="Search by name or specialty"
      variant="outlined"
      size="small"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      sx={{ mb: 3 }}
      InputProps={{
        endAdornment: (
          <IconButton sx={{ color: TEAL_ACCENT }}>
            <SearchIcon />
          </IconButton>
        ),
      }}
    />

    <Divider sx={{ my: 2 }} />

    {/* Specialty */}
    <Typography fontWeight="bold" mb={1}>
      Specialty
    </Typography>
    {loadingDepartments ? (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
        <CircularProgress size={20} />
      </Box>
    ) : (
      <Box sx={{ maxHeight: 200, overflowY: 'auto', pr: 1 }}>
        {departments.map((department) => (
          <FormControlLabel
            key={department}
            control={
              <Checkbox
                sx={{ color: TEAL_ACCENT }}
                checked={selectedSpecialties.includes(department)}
                onChange={() => handleSpecialtyChange(department)}
              />
            }
            label={department}
            sx={{ display: 'block', mb: 0.5 }}
          />
        ))}
      </Box>
    )}

    <Divider sx={{ my: 2 }} />

    {/* Price Range Filter */}
    <Typography fontWeight="bold" mb={1}>
      Price Range
    </Typography>
    <Slider
      value={priceRange}
      onChange={(e, val) => setPriceRange(val)}
      min={0}
      max={500}
      step={10}
      valueLabelDisplay="auto"
      valueLabelFormat={(value) => `$${value}`}
      sx={{ color: TEAL_ACCENT, mb: 1 }}
    />
    <Typography variant="body2" color={TEXT_SECONDARY} mb={2}>
      ${priceRange[0]} - ${priceRange[1]}
    </Typography>

    <Divider sx={{ my: 2 }} />

    {/* Gender */}
    <Typography fontWeight="bold" mb={1}>
      Gender
    </Typography>
    <FormControl fullWidth size="small" sx={{ mb: 2 }}>
      <Select
        value={gender}
        onChange={(e) => setGender(e.target.value)}
        displayEmpty
      >
        <MenuItem value="">All</MenuItem>
        <MenuItem value="Male">Male</MenuItem>
        <MenuItem value="Female">Female</MenuItem>
      </Select>
    </FormControl>

    {/* Availability */}
    <Typography fontWeight="bold" mb={1}>
      Availability
    </Typography>
    <FormControl fullWidth size="small" sx={{ mb: 2 }}>
      <Select
        value={availability}
        onChange={(e) => setAvailability(e.target.value)}
        displayEmpty
      >
        <MenuItem value="">Any</MenuItem>
        <MenuItem value="Today">Available Today</MenuItem>
        <MenuItem value="This Week">This Week</MenuItem>
      </Select>
    </FormControl>

    {/* Experience */}
    <Typography fontWeight="bold" mb={1}>
      Minimum Experience
    </Typography>
    <Slider
      value={experience}
      onChange={(e, val) => setExperience(val)}
      min={0}
      max={30}
      sx={{ color: TEAL_ACCENT, mb: 1 }}
    />
    <Typography variant="body2" color={TEXT_SECONDARY} mb={2}>
      Above {experience} years
    </Typography>

    <Divider sx={{ my: 2 }} />

    <Button
      fullWidth
      variant="outlined"
      onClick={clearFilters}
      sx={{
        color: TEAL_ACCENT,
        borderColor: TEAL_ACCENT,
        borderRadius: "10px",
        textTransform: "none",
        mb: 2,
        "&:hover": { backgroundColor: `${TEAL_ACCENT}10`, borderColor: TEAL_ACCENT },
      }}
    >
      Clear All Filters
    </Button>
  </Box>
);

export default function DoctorSearchPage() {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingDepartments, setLoadingDepartments] = useState(true);
  const [error, setError] = useState("");
  const [hoveredDoctorId, setHoveredDoctorId] = useState(null);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // ✅ Pagination states
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 4; // 2x2 grid on mobile, 3x2 or more on desktop

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialties, setSelectedSpecialties] = useState([]);
  const [experience, setExperience] = useState(0);
  const [gender, setGender] = useState("");
  const [availability, setAvailability] = useState("");
  const [priceRange, setPriceRange] = useState([0, 500]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Fetch departments from Firestore
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoadingDepartments(true);
        console.log("Fetching departments from Firestore...");

        const departmentsRef = collection(db, "Departments");
        const departmentsSnapshot = await getDocs(departmentsRef);

        const departmentsList = [];
        departmentsSnapshot.forEach((doc) => {
          const departmentData = doc.data();
          const departmentName = departmentData.name || departmentData.departmentName || doc.id;
          departmentsList.push(departmentName);
        });

        departmentsList.sort();

        console.log("Departments loaded:", departmentsList);
        setDepartments(departmentsList);
      } catch (error) {
        console.error("Error fetching departments:", error);
        const fallbackDepartments = [
          "Neurologist", "Surgeon", "Orthopedics", "Cardiology",
          "Ophthalmologist", "Dentistry", "Psychology"
        ];
        setDepartments(fallbackDepartments);
      } finally {
        setLoadingDepartments(false);
      }
    };

    fetchDepartments();
  }, []);

  // Fetch doctors with schedules
  useEffect(() => {
    const fetchDoctorsWithSchedules = async () => {
      try {
        setLoading(true);
        console.log("Fetching doctors with schedules...");

        const doctorsRef = collection(db, "Doctors");
        const doctorsSnapshot = await getDocs(doctorsRef);

        console.log(`Found ${doctorsSnapshot.size} doctors`);

        const doctorsWithSchedules = [];

        for (const doctorDoc of doctorsSnapshot.docs) {
          const doctorData = { id: doctorDoc.id, ...doctorDoc.data() };

          if (doctorData.status !== "Active") {
            console.log(`Skipping inactive doctor: ${doctorData.firstName} ${doctorData.lastName}`);
            continue;
          }

          try {
            const scheduleRef = collection(db, "Doctors", doctorDoc.id, "Schedule");
            const scheduleSnapshot = await getDocs(scheduleRef);

            const availableSlots = [];
            scheduleSnapshot.forEach(scheduleDoc => {
              const scheduleData = scheduleDoc.data();
              if (scheduleData.status === "available") {
                const scheduleDate = new Date(scheduleData.date);
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                if (scheduleDate >= today) {
                  availableSlots.push(scheduleData);
                }
              }
            });

            if (availableSlots.length > 0) {
              doctorData.scheduleCount = availableSlots.length;
              doctorData.nextAvailableDate = availableSlots
                .sort((a, b) => new Date(a.date) - new Date(b.date))[0]?.date;

              doctorsWithSchedules.push(doctorData);
              console.log(`Added doctor: ${doctorData.firstName} ${doctorData.lastName} with ${availableSlots.length} slots`);
            } else {
              console.log(`Doctor ${doctorData.firstName} ${doctorData.lastName} has no available slots`);
            }
          } catch (scheduleError) {
            console.error(`Error fetching schedule for doctor ${doctorDoc.id}:`, scheduleError);
          }
        }

        console.log(`Total doctors with schedules: ${doctorsWithSchedules.length}`);
        setDoctors(doctorsWithSchedules);
        setFilteredDoctors(doctorsWithSchedules);
        setCurrentPage(0); // ✅ Reset pagination
      } catch (error) {
        console.error("Error fetching doctors:", error);
        setError("Failed to load doctors. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorsWithSchedules();
  }, []);

  // Filter doctors based on search criteria
  useEffect(() => {
    let filtered = doctors;

    if (searchTerm) {
      filtered = filtered.filter(doctor =>
        `${doctor.firstName} ${doctor.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.department.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedSpecialties.length > 0) {
      filtered = filtered.filter(doctor =>
        selectedSpecialties.some(specialty =>
          doctor.department.toLowerCase().includes(specialty.toLowerCase())
        )
      );
    }

    if (gender) {
      filtered = filtered.filter(doctor => doctor.gender === gender);
    }

    if (experience > 0) {
      filtered = filtered.filter(doctor =>
        parseInt(doctor.yearsOfExperience || 0) >= experience
      );
    }

    filtered = filtered.filter(doctor => {
      const price = parseFloat(doctor.consultationPrice || 0);
      return price >= priceRange[0] && price <= priceRange[1];
    });

    if (availability === "Today") {
      const today = new Date().toISOString().split('T')[0];
      filtered = filtered.filter(doctor => doctor.nextAvailableDate === today);
    } else if (availability === "This Week") {
      const today = new Date();
      const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(doctor => {
        const availableDate = new Date(doctor.nextAvailableDate);
        return availableDate >= today && availableDate <= nextWeek;
      });
    }

    setFilteredDoctors(filtered);
    setCurrentPage(0); // ✅ Reset pagination when filters change
  }, [doctors, searchTerm, selectedSpecialties, gender, experience, availability, priceRange]);

  const handleSpecialtyChange = (specialty) => {
    setSelectedSpecialties(prev =>
      prev.includes(specialty)
        ? prev.filter(s => s !== specialty)
        : [...prev, specialty]
    );
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedSpecialties([]);
    setExperience(0);
    setGender("");
    setAvailability("");
    setPriceRange([0, 500]);
    setCurrentPage(0); // ✅ Reset pagination
  };

  // ✅ Pagination calculations
  const totalPages = Math.ceil(filteredDoctors.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const paginatedDoctors = filteredDoctors.slice(startIndex, startIndex + itemsPerPage);

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(0, prev - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages - 1, prev + 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress size={60} sx={{ color: TEAL_ACCENT }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        gap: 3,
        bgcolor: BACKGROUND_COLOR,
        px: { xs: 2, md: 6 },
        py: 5,
        flexDirection: { xs: "column", md: "row" },
        minHeight: "100vh",
      }}
    >
      {/* ✅ Filter Button for Mobile */}
      {isMobile && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" fontWeight="bold" color={TEAL_ACCENT}>
            Available Doctors
          </Typography>
          <IconButton
            onClick={() => setFilterDrawerOpen(true)}
            sx={{
              bgcolor: TEAL_ACCENT,
              color: 'white',
              borderRadius: 2,
              "&:hover": { bgcolor: "#002B7A" },
            }}
          >
            <TuneIcon />
          </IconButton>
        </Box>
      )}

      {/* Desktop: Sticky Filters */}
      <Paper
        elevation={1}
        sx={{
          flex: "0 0 320px",
          borderRadius: "20px",
          border: `1px solid ${BORDER_COLOR}`,
          p: 3,
          backgroundColor: "white",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          position: { md: "sticky" },
          top: 20,
          alignSelf: "flex-start",
          height: "fit-content",
          display: { xs: "none", md: "block" },
        }}
      >
        <FilterPanel
          departments={departments}
          loadingDepartments={loadingDepartments}
          selectedSpecialties={selectedSpecialties}
          handleSpecialtyChange={handleSpecialtyChange}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          gender={gender}
          setGender={setGender}
          availability={availability}
          setAvailability={setAvailability}
          experience={experience}
          setExperience={setExperience}
          clearFilters={clearFilters}
        />
      </Paper>

      <Drawer
        anchor="right"
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: "70%", sm: "400px" },
            p: 3,
            borderRadius: "20px 0 0 20px",
          },
        }}
      >
        <FilterPanel
          departments={departments}
          loadingDepartments={loadingDepartments}
          selectedSpecialties={selectedSpecialties}
          handleSpecialtyChange={handleSpecialtyChange}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          gender={gender}
          setGender={setGender}
          availability={availability}
          setAvailability={setAvailability}
          experience={experience}
          setExperience={setExperience}
          clearFilters={clearFilters}
          onClose={() => setFilterDrawerOpen(false)}
        />
      </Drawer>

      {/* RIGHT — Doctor List */}
      <Box sx={{ flex: 1 }}>
        {!isMobile && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography
              variant="h4"
              fontWeight="bold"
              color={TEAL_ACCENT}
              textAlign="left"
            >
              Available Doctors
            </Typography>
            <Typography variant="body1" color={TEXT_SECONDARY}>
              {filteredDoctors.length} doctors found
            </Typography>
          </Box>
        )}

        {/* Mobile: Show count under button */}
        {isMobile && (
          <Typography variant="body1" color={TEXT_SECONDARY} mb={2}>
            {filteredDoctors.length} doctors found
          </Typography>
        )}

        {filteredDoctors.length === 0 ? (
          <Alert severity="info" sx={{ mb: 3 }}>
            No doctors found with your current filters. Try adjusting your search criteria.
          </Alert>
        ) : (
          <>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {paginatedDoctors.map((doctor) => (
                <Grid item xs={6} sm={6} md={4} key={doctor.id}>
                  <DoctorCard
                    doctor={doctor}
                    isFeatured={hoveredDoctorId === doctor.id}
                    onHover={setHoveredDoctorId}
                  />
                </Grid>
              ))}
            </Grid>

            {/* ✅ Pagination Controls */}
            {totalPages > 1 && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 2,
                  mt: 4,
                  flexWrap: 'wrap',
                }}
              >
                <Button
                  variant="outlined"
                  startIcon={<ChevronLeftIcon />}
                  onClick={handlePreviousPage}
                  disabled={currentPage === 0}
                  sx={{
                    color: TEAL_ACCENT,
                    borderColor: TEAL_ACCENT,
                    borderRadius: "10px",
                    textTransform: "none",
                    "&:disabled": { borderColor: "#ccc", color: "#999" },
                  }}
                >
                  Previous
                </Button>

                {/* Page Indicator */}
                <Box
                  sx={{
                    px: 2.5,
                    py: 1,
                    bgcolor: `${TEAL_ACCENT}10`,
                    borderRadius: "10px",
                    minWidth: "140px",
                    textAlign: 'center',
                    fontWeight: 600,
                    color: TEAL_ACCENT,
                  }}
                >
                  Page {currentPage + 1} of {totalPages}
                </Box>

                <Button
                  variant="outlined"
                  endIcon={<ChevronRightIcon />}
                  onClick={handleNextPage}
                  disabled={currentPage >= totalPages - 1}
                  sx={{
                    color: TEAL_ACCENT,
                    borderColor: TEAL_ACCENT,
                    borderRadius: "10px",
                    textTransform: "none",
                    "&:disabled": { borderColor: "#ccc", color: "#999" },
                  }}
                >
                  Next
                </Button>
              </Box>
            )}

            {/* Items Info */}
            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Typography variant="caption" color={TEXT_SECONDARY}>
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredDoctors.length)} of {filteredDoctors.length} doctors
              </Typography>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}