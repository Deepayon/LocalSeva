"use client";

import {
/* Handshake as HandshakeRaw, */ // Handshake icon does not exist in lucide-react
Shield as ShieldRaw,
Lightbulb as LightbulbRaw,
Globe as GlobeRaw,
Users as UsersRaw,
Heart as HeartRaw,
Target as TargetRaw,
Award as AwardRaw,
MapPin as MapPinRaw,
TrendingUp as TrendingUpRaw,
Clock as ClockRaw,
Star as StarRaw,
Building as BuildingRaw,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
Users,
Heart,
Target,
Award,
MapPin,
TrendingUp,
Shield,
Clock,
Star,
Building,
Lightbulb,
Globe
} from "lucide-react";

// Safe fallbacks for icons (non-destructive; original imports remain)
const Safe = {
Users: Users ?? UsersRaw,
Heart: Heart ?? HeartRaw,
Target: Target ?? TargetRaw,
Award: Award ?? AwardRaw,
MapPin: MapPin ?? MapPinRaw,
TrendingUp: TrendingUp ?? TrendingUpRaw,
Shield: Shield ?? ShieldRaw,
Clock: Clock ?? ClockRaw,
Star: Star ?? StarRaw,
Building: Building ?? BuildingRaw,
Lightbulb: Lightbulb ?? LightbulbRaw,
Handshake: Users ?? UsersRaw, // fallback to Users icon as Handshake is missing
Globe: Globe ?? GlobeRaw,
};

export default function AboutPage() {
const stats = [
{ icon: Safe.Users, label: "Active Users", value: "50,000+" },
{ icon: Safe.MapPin, label: "Neighborhoods", value: "500+" },
{ icon: Safe.Building, label: "Cities", value: "25+" },
{ icon: Safe.Heart, label: "Services Exchanged", value: "100,000+" }
];

const values = [
{
icon: Safe.Shield,
title: "Trust & Safety",
description: "We prioritize community safety with verified profiles and secure transactions."
},
{
icon: Safe.Handshake,
title: "Community First",
description: "Building stronger neighborhoods through mutual support and collaboration."
},
{
icon: Safe.Lightbulb,
title: "Innovation",
description: "Leveraging technology to solve real community problems efficiently."
},
{
icon: Safe.Globe,
title: "Sustainability",
description: "Promoting eco-friendly practices and resource sharing within communities."
}
];

const timeline = [
{
year: "2024",
title: "LocalSeva Founded",
description: "Started with a vision to connect Indian neighborhoods through technology."
},
{
year: "2024",
title: "Beta Launch",
description: "Launched in Bangalore with 5 core services and 10 pilot neighborhoods."
},
{
year: "2024",
title: "Rapid Growth",
description: "Expanded to 25+ cities across India with 50,000+ active users."
},
{
year: "2025",
title: "Future Vision",
description: "Planning to launch AI-powered features and expand to international markets."
}
];

const team = [
{
name: "Deepayan Das",
role: "Founder & CEO",
bio: "Passionate about building community-driven solutions for urban challenges."
},
{
name: "Priya Sharma",
role: "CTO",
bio: "Technology enthusiast with expertise in scalable platforms and user experience."
},
{
name: "Rahul Patel",
role: "Head of Operations",
bio: "Community building expert with a background in urban development."
},
{
name: "Ananya Reddy",
role: "Head of Marketing",
bio: "Marketing strategist focused on community engagement and growth."
}
];

return (
<div className="min-h-screen bg-gray-50">
{/* Hero Section */}
<div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-20">
<div className="max-w-7xl mx-auto px-4 text-center">
<h1 className="text-5xl font-bold mb-6">About LocalSeva</h1>
<p className="text-xl text-orange-100 mb-8 max-w-3xl mx-auto">
Building stronger communities through technology, trust, and mutual support.
We're India's leading hyperlocal platform connecting neighbors to share services,
information, and resources.
</p>
<div className="flex justify-center space-x-4">
<Button size="lg" className="bg-white text-orange-500 hover:bg-gray-100">
Join Our Community
</Button>
<Button size="lg" variant="outline" className="border-white text-white hover:bg-orange-500 hover:border-orange-500">
Learn More
</Button>
</div>
</div>
</div>

text
  {/* Stats Section */}
  <div className="py-16 bg-white">
    <div className="max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <div className="flex justify-center mb-4">
              <stat.icon className="h-12 w-12 text-orange-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
            <div className="text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  </div>

  {/* Mission Section */}
  <div className="py-16">
    <div className="max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-4xl font-bold mb-6">Our Mission</h2>
          <p className="text-lg text-gray-600 mb-6">
            At LocalSeva, we believe in the power of community. Our mission is to strengthen 
            neighborhood bonds by creating a trusted platform where residents can easily share 
            services, information, and resources.
          </p>
          <p className="text-lg text-gray-600 mb-6">
            We're building more than just an app – we're creating a movement towards more 
            connected, sustainable, and supportive urban communities across India.
          </p>
          <div className="flex space-x-4">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              <Safe.Target className="h-4 w-4 mr-2" />
              Community-Driven
            </Badge>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              <Safe.Heart className="h-4 w-4 mr-2" />
              Trust-Based
            </Badge>
          </div>
        </div>
        <div className="relative">
          <div className="bg-orange-100 rounded-lg p-8 h-96 flex items-center justify-center">
            <div className="text-center">
              <Safe.Heart className="h-24 w-24 text-orange-500 mx-auto mb-4" />
              <p className="text-orange-700 text-lg">Building Communities Together</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* Values Section */}
  <div className="py-16 bg-white">
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">Our Core Values</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          These principles guide everything we do and shape the future of community engagement.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {values.map((value, index) => (
          <Card key={index} className="text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <value.icon className="h-12 w-12 text-orange-500" />
              </div>
              <CardTitle className="text-xl">{value.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{value.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </div>

  {/* Timeline Section */}
  <div className="py-16">
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">Our Journey</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          From a simple idea to a nationwide movement, here's our story of growth and impact.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {timeline.map((item, index) => (
          <Card key={index} className="relative">
            <CardHeader>
              <Badge className="w-fit mb-2">{item.year}</Badge>
              <CardTitle className="text-lg">{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{item.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </div>

  {/* Team Section */}
  <div className="py-16 bg-white">
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">Meet Our Team</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Passionate individuals committed to building stronger communities across India.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {team.map((member, index) => (
          <Card key={index} className="text-center">
            <CardHeader>
              <div className="w-24 h-24 bg-orange-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Safe.Users className="h-12 w-12 text-orange-500" />
              </div>
              <CardTitle className="text-xl">{member.name}</CardTitle>
              <Badge variant="outline">{member.role}</Badge>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{member.bio}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </div>

  {/* Impact Section */}
  <div className="py-16">
    <div className="max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-4xl font-bold mb-6">Our Impact</h2>
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <Safe.TrendingUp className="h-6 w-6 text-green-500 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Economic Empowerment</h3>
                <p className="text-gray-600">
                  Facilitated over ₹5 crore in community transactions, supporting local 
                  economies and creating income opportunities.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <Safe.Clock className="h-6 w-6 text-blue-500 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Time Saved</h3>
                <p className="text-gray-600">
                  Helped community members save over 100,000 hours through efficient 
                  service exchanges and information sharing.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <Safe.Award className="h-6 w-6 text-purple-500 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Community Building</h3>
                <p className="text-gray-600">
                  Strengthened neighborhood bonds with over 50,000 positive interactions 
                  and mutual support exchanges.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg p-8 h-96 flex items-center justify-center">
          <div className="text-center">
            <Safe.Star className="h-24 w-24 text-orange-500 mx-auto mb-4" />
            <p className="text-orange-700 text-lg font-medium">
              Making a Difference, One Neighborhood at a Time
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* CTA Section */}
  <div className="bg-orange-500 text-white py-16">
    <div className="max-w-7xl mx-auto px-4 text-center">
      <h2 className="text-4xl font-bold mb-4">Join Our Community</h2>
      <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
        Be part of the movement that's transforming Indian neighborhoods. 
        Together, we can build stronger, more connected communities.
      </p>
      <div className="flex justify-center space-x-4">
        <Button size="lg" className="bg-white text-orange-500 hover:bg-gray-100">
          Get Started
        </Button>
        <Button size="lg" variant="outline" className="border-white text-white hover:bg-orange-500 hover:border-orange-500">
          Learn More
        </Button>
      </div>
    </div>
  </div>
</div>
);
}