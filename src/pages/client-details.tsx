import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, Edit, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreateClientDialog } from '@/components/clients/create-client-dialog';

const mockClientData = {
  personalInfo: {
    gender: "Male",
    dateOfBirth: "1990-05-15",
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    phoneNumber: "+1234567890",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&auto=format&fit=crop&crop=face"
  },
  healthInfo: {
    bloodPressure: "Normal",
    bloodType: "A_Positive",
    bloodSugarLevel: 95.5,
    weight: 75.5,
    height: 180,
    chronicConditions: "None",
    allergies: "Peanuts",
    activelyUsedDrugs: "None",
    hasDisease: false,
    diseases: []
  },
  lifeStyleInfo: {
    physicalActivity: "Moderate",
    sleepHours: 7.5,
    stressLevel: "Low",
    smoking: "None",
    alcohol: "Occasional"
  },
  diets: [
    {
      dietName: "Low Carb Diet",
      dietDescription: "A diet focused on reducing carbohydrate intake",
      dietType: "Weight Loss",
      dietDuration: 30,
      startDate: "2024-01-01",
      endDate: "2024-01-31",
      isActive: true,
      progress: 65
    }
  ]
};

export default function ClientDetailsPage() {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-8">
          <Link to="/client-list">
            <Button variant="ghost" size="sm" className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Clients
            </Button>
          </Link>
          <div className="flex-1 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <img
                src={mockClientData.personalInfo.avatar}
                alt={`${mockClientData.personalInfo.firstName} ${mockClientData.personalInfo.lastName}`}
                className="h-16 w-16 rounded-full object-cover border-2 border-primary"
              />
              <div>
                <h1 className="text-3xl font-bold">
                  {mockClientData.personalInfo.firstName} {mockClientData.personalInfo.lastName}
                </h1>
                <div className="flex items-center space-x-4 text-muted-foreground mt-1">
                  <span className="flex items-center">
                    <Mail className="h-4 w-4 mr-1" />
                    {mockClientData.personalInfo.email}
                  </span>
                  <span className="flex items-center">
                    <Phone className="h-4 w-4 mr-1" />
                    {mockClientData.personalInfo.phoneNumber}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <CreateClientDialog />
              <Button>
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="bg-muted/50 p-1">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="health">Health Info</TabsTrigger>
            <TabsTrigger value="lifestyle">Lifestyle</TabsTrigger>
            <TabsTrigger value="diets">Diet Plans</TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                    <p className="text-lg">{mockClientData.personalInfo.firstName} {mockClientData.personalInfo.lastName}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Gender</p>
                    <p className="text-lg">{mockClientData.personalInfo.gender}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Date of Birth</p>
                    <p className="text-lg">{mockClientData.personalInfo.dateOfBirth}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <p className="text-lg">{mockClientData.personalInfo.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="health">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Health Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="border-2">
                    <CardHeader>
                      <CardTitle className="text-lg">Vital Signs</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm text-muted-foreground">Blood Pressure</p>
                          <p className="text-lg font-medium">{mockClientData.healthInfo.bloodPressure}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Blood Type</p>
                          <p className="text-lg font-medium">{mockClientData.healthInfo.bloodType}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-2">
                    <CardHeader>
                      <CardTitle className="text-lg">Body Metrics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm text-muted-foreground">Weight</p>
                          <p className="text-lg font-medium">{mockClientData.healthInfo.weight} kg</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Height</p>
                          <p className="text-lg font-medium">{mockClientData.healthInfo.height} cm</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-2">
                    <CardHeader>
                      <CardTitle className="text-lg">Medical History</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm text-muted-foreground">Allergies</p>
                          <p className="text-lg font-medium">{mockClientData.healthInfo.allergies}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Chronic Conditions</p>
                          <p className="text-lg font-medium">{mockClientData.healthInfo.chronicConditions}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="lifestyle">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Lifestyle Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.entries(mockClientData.lifeStyleInfo).map(([key, value]) => (
                    <Card key={key} className="border-2">
                      <CardContent className="pt-6">
                        <p className="text-sm text-muted-foreground capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </p>
                        <p className="text-lg font-medium mt-1">
                          {typeof value === 'number' ? `${value} hours` : value}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="diets">
            <div className="space-y-6">
              {mockClientData.diets.map((diet, index) => (
                <Card key={index} className="shadow-lg">
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                      <div>
                        <h3 className="text-xl font-semibold">{diet.dietName}</h3>
                        <p className="text-muted-foreground mt-1">{diet.dietDescription}</p>
                      </div>
                      <Badge variant={diet.isActive ? "default" : "secondary"} className="mt-2 md:mt-0">
                        {diet.isActive ? "Active" : "Completed"}
                      </Badge>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-muted/50 rounded-full h-2.5">
                        <div
                          className="bg-primary h-2.5 rounded-full transition-all"
                          style={{ width: `${diet.progress}%` }}
                        />
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Type</p>
                          <p className="font-medium">{diet.dietType}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Duration</p>
                          <p className="font-medium">{diet.dietDuration} days</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Start Date</p>
                          <p className="font-medium">{diet.startDate}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">End Date</p>
                          <p className="font-medium">{diet.endDate}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <div className="flex justify-center">
                <Button className="w-full max-w-sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  Create New Diet Plan
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}