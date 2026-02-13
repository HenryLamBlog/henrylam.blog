import BlogPostLayout from '../../components/BlogPostLayout';

export default function RobotControlledVehicle() {
  return (
    <BlogPostLayout relatedSlugs={['assembling-iphone-from-parts', '3d-box-shooter-game', 'roller-madness']}>
      <h1>Robot-Controlled Vehicle</h1>
      <h2>Embarking on a Journey of Robotics Innovation</h2>
      <p>As part of our project, we embarked on an exciting journey to create a robot vehicle equipped with advanced control circuits and sensors. Our goal was to design a versatile robot capable of navigating through a predefined course with precision and efficiency. Let me walk you through the details of our project and the process of bringing our robot to life.</p>
      <p>Our endeavor began with a solid foundation in the fundamentals of robotics, which we gained through weeks of intensive coursework. We delved into topics ranging from basic components and electrical principles to advanced concepts like pulse-width modulation and logic design.</p>
      <p>Throughout the course, we explored critical areas such as energy regulation, sensor integration, and sequential logic, each building upon the last to provide a comprehensive understanding of robot control systems. Hands-on lab sessions reinforced our theoretical knowledge, allowing us to apply principles learned in the classroom to real-world scenarios.</p>
      <h2>Building the Robot Vehicle</h2>
      <p>In our pursuit of creating a versatile robot vehicle, we meticulously assembled components and configured control circuits on a breadboard. At the heart of our design lay the Arduino Nano board, a powerful microcontroller that acted as the brain of our robot. We carefully integrated two light sensors onto the vehicle, strategically positioning them to perceive and interact with the environment effectively.</p>
      <img src="/images/build_vehicle.JPG" alt="Building the Vehicle" className="mx-auto rounded-lg shadow-md max-w-full" />
      <p className="text-sm text-center text-text-muted italic">Building the Vehicle</p>
      <p>The assembly process involved connecting various components such as the Arduino board, motor drivers, light sensors, and power source on the breadboard. Each component played a critical role in the robot's functionality, contributing to its ability to perceive and respond to its surroundings.</p>
      <img src="/images/breadboard.JPG" alt="Configuring the Breadboard" className="mx-auto rounded-lg shadow-md max-w-full" />
      <p className="text-sm text-center text-text-muted italic">Configuring the Breadboard</p>
      <h2>Understanding the Light Sensors</h2>
      <p>A thorough understanding of light sensors was crucial for our robot to navigate autonomously. We incorporated line tracking sensors, allowing the robot to detect white lines on the demo mat guiding its movement along the predefined course. These sensors were connected to Arduino input terminals, facilitating real-time processing of sensor data for precise course tracking.</p>
      <img src="/images/sensors.png" alt="Light Sensors" className="mx-auto rounded-lg shadow-md max-w-full" />
      <p className="text-sm text-center text-text-muted italic">Light Sensors</p>
      <h2>Arduino Control Logic</h2>
      <p>Programming the Arduino board was fundamental to our robot's control system, enabling intelligent decision-making and motor control. We developed custom code to interpret sensor inputs and execute motor commands. Through logical decision-making and signal modulation, we ensured our robot could navigate the course autonomously with minimal intervention.</p>
      <p>The Arduino acted as the central processing unit, continuously monitoring sensor inputs and executing predefined algorithms to govern the robot's behavior. It processed data from the line tracking sensors, determining the appropriate course of action based on predefined logic. Through conditional statements and feedback loops, we ensured the robot could adapt to dynamic environments and navigate complex courses. The Arduino controlled motor drivers, regulating speed and direction using pulse-width modulation signals, allowing the robot to traverse the course with stability.</p>
      <img src="/images/final_vehicle.JPG" alt="Finalized Robot-Controlled Vehicle" className="mx-auto rounded-lg shadow-md max-w-full" />
      <p className="text-sm text-center text-text-muted italic">Finalized Robot-Controlled Vehicle</p>
      <h2>Executing the Run</h2>
      <p>With our hardware and software components in place, we conducted multiple tests to ensure that the vehicle could sense the line on the ground and move accordingly. From powering up to reaching the end of the course, our robot executed each task with precision and accuracy, a testament to our meticulous design and programming efforts. However, we encountered challenges with the placement of the light sensors when navigating perfect perpendicular lines, requiring further adjustments and fine-tuning.</p>
      <div className="relative w-full aspect-video">
        <iframe
          className="absolute inset-0 w-full h-full rounded-lg"
          src="https://www.youtube.com/embed/LrUEvqedrPQ"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>

      <p></p>
      <p></p>
      <h2>Conclusion:</h2>
      <p>Our project exemplifies the fusion of hardware and software to create a functional and efficient robot vehicle. Through meticulous design and programming, we successfully developed a robot capable of maneuvering through complex courses with ease. While we celebrate our achievements, we recognize that innovation is an ongoing process. As we continue to refine our design and explore new possibilities, we remain committed to pushing the boundaries of robotics and automation.</p>
      <p>Reflecting on this journey, I must say that it has been an incredibly enjoyable experience delving into the world of hardware and building our robot vehicle. Throughout this process, I've gained invaluable insights and practical skills that have deepened my understanding of robotics. As we conclude this project, I'm excited to apply what I've learned to future endeavors, embracing the spirit of innovation and discovery in the realm of technology.</p>
    </BlogPostLayout>
  );
}
