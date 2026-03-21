import HeroLayout from "@/layouts/HeroLayout";

const AboutUs = () => {
  return (
    <main className="container mx-auto py-12">
      <h2 className="text-primary">About us</h2>
      {/* Add your paragraph content here; p tags will be styled automatically */}
    </main>
  );
};

export default AboutUs;
AboutUs.getLayout = (page: any) => <HeroLayout>{page}</HeroLayout>;