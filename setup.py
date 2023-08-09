from setuptools import setup, find_packages

with open("requirements.txt") as f:
	install_requires = f.read().strip().split("\n")

# get version from __version__ variable in design_app/__init__.py
from design_app import __version__ as version

setup(
	name="design_app",
	version=version,
	description="Design App",
	author="Umer",
	author_email="farooqx2560@gmail.com",
	packages=find_packages(),
	zip_safe=False,
	include_package_data=True,
	install_requires=install_requires
)
